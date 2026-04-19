import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes, navigate directly to admin dashboard
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Strip */}
          <div className="bg-[#3B3B3B] px-6 py-4">
            <h1 className="text-2xl font-semibold text-white text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
              United Hotels
            </h1>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-[#3B3B3B] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Partner Portal
              </h2>
              <p className="text-sm text-[#8C8C8C]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Sign in to manage your hotel
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-[#3B3B3B] mb-2"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[#EAEAEA] bg-white px-4 py-3 text-[#3B3B3B] placeholder:text-[#8C8C8C] focus:border-[#1ABC9C] focus:outline-none focus:ring-2 focus:ring-[#1ABC9C]/20 transition-all"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                  placeholder="admin@unitedhotels.com"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-[#3B3B3B] mb-2"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-[#EAEAEA] bg-white px-4 py-3 pr-11 text-[#3B3B3B] placeholder:text-[#8C8C8C] focus:border-[#1ABC9C] focus:outline-none focus:ring-2 focus:ring-[#1ABC9C]/20 transition-all"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C8C8C] hover:text-[#3B3B3B] transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" strokeWidth={1.5} />
                    ) : (
                      <Eye className="h-5 w-5" strokeWidth={1.5} />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-[#EAEAEA] text-[#1ABC9C] focus:ring-[#1ABC9C]/20"
                  />
                  <span className="text-sm text-[#3B3B3B]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Remember me
                  </span>
                </label>
                <a 
                  href="#" 
                  className="text-sm text-[#1ABC9C] hover:text-[#16A085] transition-colors"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full rounded-lg bg-[#1ABC9C] px-6 py-3.5 font-semibold text-white hover:bg-[#16A085] active:bg-[#138D75] transition-colors shadow-sm"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Sign In
              </button>
            </form>

            {/* Footer Text */}
            <p className="mt-6 text-center text-xs text-[#8C8C8C]" style={{ fontFamily: 'Inter, sans-serif' }}>
              This portal is for authorized hotel partners only
            </p>
          </div>
        </div>

        {/* Back to Guest Site Link */}
        <div className="mt-6 text-center">
          <a 
            href="/auth" 
            className="text-sm text-[#8C8C8C] hover:text-[#3B3B3B] transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            ← Back to guest login
          </a>
        </div>
      </div>
    </div>
  );
}
