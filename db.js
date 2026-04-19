// Postgres (Neon) connection using node-postgres
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL is not set. Add it to your environment configuration.');
}

const pool = new Pool({
    connectionString,
    ssl: process.env.PG_SSL === 'false' ? false : { rejectUnauthorized: false }
});

pool.on('connect', () => {
    console.log('Postgres Database Connected Successfully');
});

pool.on('error', (err) => {
    console.error('Postgres Database Connection Error', err);
});

module.exports = pool;
