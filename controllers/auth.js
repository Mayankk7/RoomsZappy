const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendMail = require('../utils/mailer');

let userMetaCache = null;
const otpStore = new Map();
const OTP_TTL_MS = 10 * 60 * 1000;

const pickColumn = (set, names) => names.find((n) => set.has(n)) || null;

const getUserMeta = async () => {
  if (userMetaCache) return userMetaCache;

  const result = await pool.query(
    `SELECT column_name FROM information_schema.columns WHERE table_name = 'users'`
  );
  const cols = new Set(result.rows.map((r) => r.column_name));

  userMetaCache = {
    phoneCol: pickColumn(cols, ['phoneNumber', 'phonenumber', 'phone_number']),
    isAdminCol: pickColumn(cols, ['isAdmin', 'isadmin', 'is_admin']),
    isManagerCol: pickColumn(cols, ['isManager', 'ismanager', 'is_manager']),
    createdCol: pickColumn(cols, ['createdAt', 'created_at']),
    updatedCol: pickColumn(cols, ['updatedAt', 'updated_at'])
  };

  return userMetaCache;
};

const quoteCol = (col) => `"${col}"`;

const mapUser = (row, meta) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  phoneNumber: meta.phoneCol ? row[meta.phoneCol] : null,
  isAdmin: meta.isAdminCol ? Boolean(row[meta.isAdminCol]) : false,
  isManager: meta.isManagerCol ? Boolean(row[meta.isManagerCol]) : false,
  createdAt: meta.createdCol ? row[meta.createdCol] : null,
  updatedAt: meta.updatedCol ? row[meta.updatedCol] : null
});

const generateToken = (userId, isAdmin, isManager) => {
  const secret = process.env.JWT_SECRET || 'replace-me-with-secure-secret';
  return jwt.sign({ userId, isAdmin, isManager }, secret, { expiresIn: '7d' });
};

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

const sendRegisterOtp = async (req, res) => {
  const { email, name } = req.body || {};
  if (!email || !String(email).includes('@')) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  try {
    const otp = generateOtp();
    otpStore.set(String(email).toLowerCase(), {
      otp,
      expiresAt: Date.now() + OTP_TTL_MS,
      attempts: 0
    });

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
        <h2 style="margin-bottom: 8px;">Welcome to United Hotels</h2>
        <p>Hello ${name ? String(name) : 'Guest'},</p>
        <p>Your verification code is:</p>
        <div style="font-size: 28px; font-weight: 700; letter-spacing: 4px; color: #1abc9c; margin: 12px 0;">${otp}</div>
        <p>This code expires in 10 minutes.</p>
      </div>
    `;

    await sendMail(email, html, 'Your United Hotels verification code');
    return res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const verifyRegisterOtp = async (req, res) => {
  const { email, otp } = req.body || {};
  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }

  const key = String(email).toLowerCase();
  const record = otpStore.get(key);
  if (!record) {
    return res.status(400).json({ error: 'OTP not found. Please request a new one.' });
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(key);
    return res.status(400).json({ error: 'OTP expired. Please request a new one.' });
  }

  if (String(record.otp) !== String(otp)) {
    record.attempts += 1;
    if (record.attempts >= 5) {
      otpStore.delete(key);
      return res.status(400).json({ error: 'Too many invalid attempts. Request a new OTP.' });
    }
    otpStore.set(key, record);
    return res.status(400).json({ error: 'Invalid OTP' });
  }

  otpStore.delete(key);
  const secret = process.env.JWT_SECRET || 'replace-me-with-secure-secret';
  const otpVerifiedToken = jwt.sign(
    { email: key, purpose: 'register_otp' },
    secret,
    { expiresIn: '15m' }
  );

  return res.json({ message: 'OTP verified', otpVerifiedToken });
};

const registerUser = async (req, res) => {
  const { name, email, password, phoneNumber, isAdmin = false, isManager = false, otpVerifiedToken } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const requireOtp = String(process.env.REQUIRE_EMAIL_OTP || 'false').toLowerCase() !== 'false';
  if (requireOtp) {
    if (!otpVerifiedToken) {
      return res.status(400).json({ error: 'OTP verification is required before registration' });
    }

    try {
      const secret = process.env.JWT_SECRET || 'replace-me-with-secure-secret';
      const decoded = jwt.verify(otpVerifiedToken, secret);
      if (decoded.purpose !== 'register_otp' || String(decoded.email || '').toLowerCase() !== String(email).toLowerCase()) {
        return res.status(401).json({ error: 'Invalid OTP verification token' });
      }
    } catch (_e) {
      return res.status(401).json({ error: 'OTP verification token expired or invalid' });
    }
  }

  try {
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rowCount > 0) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const meta = await getUserMeta();
    const hashedPassword = await bcrypt.hash(password, 10);

    let phone = null;
    if (phoneNumber) {
      const cleanPhone = String(phoneNumber).replace(/\D/g, '');
      phone = cleanPhone || null;
    }

    const columns = ['name', 'email', 'password'];
    const values = [name, email, hashedPassword];

    if (meta.phoneCol) {
      columns.push(quoteCol(meta.phoneCol));
      values.push(phone);
    }
    if (meta.isAdminCol) {
      columns.push(quoteCol(meta.isAdminCol));
      values.push(Boolean(isAdmin));
    }
    if (meta.isManagerCol) {
      columns.push(quoteCol(meta.isManagerCol));
      values.push(Boolean(isManager));
    }
    if (meta.createdCol) {
      columns.push(quoteCol(meta.createdCol));
      values.push(new Date().toISOString());
    }
    if (meta.updatedCol) {
      columns.push(quoteCol(meta.updatedCol));
      values.push(new Date().toISOString());
    }

    const placeholders = values.map((_, idx) => `$${idx + 1}`);
    const insertResult = await pool.query(
      `INSERT INTO users (${columns.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING id`
    , values);

    const id = insertResult.rows[0].id;
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    const user = mapUser(userResult.rows[0], meta);
    const token = generateToken(user.id, user.isAdmin, user.isManager);

    return res.status(201).json({ message: 'User registered successfully', user, token });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const meta = await getUserMeta();
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const row = userResult.rows[0];

    if (!row) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, row.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = mapUser(row, meta);
    const token = generateToken(user.id, user.isAdmin, user.isManager);

    return res.json({
      message: 'Login successful',
      user,
      token
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const meta = await getUserMeta();
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    if (userResult.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ user: mapUser(userResult.rows[0], meta) });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = { registerUser, loginUser, getCurrentUser, sendRegisterOtp, verifyRegisterOtp };
