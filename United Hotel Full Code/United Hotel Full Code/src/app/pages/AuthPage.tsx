import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle, Loader } from "lucide-react";
import svgPaths from "../../imports/svg-nnzqmx1xjq";
import { authService, RegisterRequest, LoginRequest } from "../services/api";
import { toast } from "sonner";

export function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine where to go after auth: use returnUrl query param, state, or sessionStorage
  const getReturnUrl = () => {
    const params = new URLSearchParams(location.search);
    const fromQuery = params.get("returnUrl");
    const fromState = (location.state as any)?.returnUrl;
    const fromStorage = sessionStorage.getItem("authReturnUrl");
    return fromQuery || fromState || fromStorage || "/booking/step2";
  };

  const doRedirect = () => {
    const url = getReturnUrl();
    sessionStorage.removeItem("authReturnUrl");
    navigate(url);
  };

  const [activeTab, setActiveTab] = useState<"login" | "register" | "guest">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: ""
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.email.includes("@")) newErrors.email = "Invalid email format";

    if (activeTab === "login") {
      if (!formData.password) newErrors.password = "Password is required";
    } else if (activeTab === "register") {
      if (!formData.name) newErrors.name = "Name is required";
      if (!formData.password) newErrors.password = "Password is required";
      if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords don't match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const credentials: LoginRequest = {
        email: formData.email,
        password: formData.password,
      };

      const response = await authService.login(credentials);
      
      toast.success("Login successful!");
      doRedirect();
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || "Login failed. Please try again.";
      setErrors({ submit: errorMessage });
      toast.error(errorMessage);
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const registerData: RegisterRequest = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber ? parseInt(formData.phoneNumber) : undefined,
      };

      await authService.register(registerData);
      
      toast.success("Registration successful! Please log in.");
      setFormData({ name: "", email: "", password: "", confirmPassword: "", phoneNumber: "" });
      setActiveTab("login");
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || "Registration failed. Please try again.";
      setErrors({ submit: errorMessage });
      toast.error(errorMessage);
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestContinue = () => {
    doRedirect();
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-5 md:p-10">
        <div className="w-full max-w-[480px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-6 md:mb-10">
            <div className="h-[26px] w-7">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 26">
                <mask fill="white" id="path-1-inside-1_20_512">
                  <path d={svgPaths.p32095b00} />
                </mask>
                <path d={svgPaths.p32095b00} fill="#1ABC9C" mask="url(#path-1-inside-1_20_512)" stroke="#1ABC9C" strokeWidth="0.4" />
              </svg>
            </div>
            <span className="font-['Poppins:SemiBold',sans-serif] text-[20px] text-[#1abc9c]">
              United Hotels
            </span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="font-['Poppins:Bold',sans-serif] text-[28px] md:text-[36px] leading-tight text-[#3b3b3b] mb-3">
              Complete Your Booking
            </h1>
            <p className="font-['Inter:Regular',sans-serif] text-[16px] text-[#6b7280]">
              Sign in to continue or create a new account
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 bg-white p-1.5 rounded-xl border border-[#eaeaea]">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-3 rounded-lg font-['Inter:SemiBold',sans-serif] text-[15px] transition-all ${
                activeTab === "login"
                  ? "bg-[#1abc9c] text-white"
                  : "text-[#6b7280] hover:text-[#3b3b3b]"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-3 rounded-lg font-['Inter:SemiBold',sans-serif] text-[15px] transition-all ${
                activeTab === "register"
                  ? "bg-[#1abc9c] text-white"
                  : "text-[#6b7280] hover:text-[#3b3b3b]"
              }`}
            >
              Register
            </button>
            <button
              onClick={() => setActiveTab("guest")}
              className={`flex-1 py-3 rounded-lg font-['Inter:SemiBold',sans-serif] text-[15px] transition-all ${
                activeTab === "guest"
                  ? "bg-[#1abc9c] text-white"
                  : "text-[#6b7280] hover:text-[#3b3b3b]"
              }`}
            >
              Guest
            </button>
          </div>

          {/* Login Form */}
          {activeTab === "login" && (
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Error Alert */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="font-['Inter:Regular',sans-serif] text-[14px] text-red-700">{errors.submit}</p>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block font-['Inter:Medium',sans-serif] text-[15px] text-[#3b3b3b] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8c8c8c]" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                    className={`w-full pl-12 pr-4 py-3.5 border rounded-xl font-['Inter:Regular',sans-serif] text-[16px] focus:outline-none focus:ring-2 transition-all ${
                      errors.email
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                        : "border-[#eaeaea] focus:border-[#1abc9c] focus:ring-[#1abc9c]/20"
                    }`}
                    placeholder="you@example.com"
                    disabled={loading}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1 font-['Inter:Regular',sans-serif]">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block font-['Inter:Medium',sans-serif] text-[15px] text-[#3b3b3b] mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8c8c8c]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      if (errors.password) setErrors({ ...errors, password: "" });
                    }}
                    className={`w-full pl-12 pr-12 py-3.5 border rounded-xl font-['Inter:Regular',sans-serif] text-[16px] focus:outline-none focus:ring-2 transition-all ${
                      errors.password
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                        : "border-[#eaeaea] focus:border-[#1abc9c] focus:ring-[#1abc9c]/20"
                    }`}
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8c8c8c] hover:text-[#3b3b3b]"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1 font-['Inter:Regular',sans-serif]">{errors.password}</p>}
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <button
                  type="button"
                  className="font-['Inter:Medium',sans-serif] text-[14px] text-[#1abc9c] hover:text-[#16a085] transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1abc9c] text-white py-4 rounded-xl hover:bg-[#16a085] transition-colors font-['Inter:SemiBold',sans-serif] text-[16px] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    Continue to Booking
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Register Form */}
          {activeTab === "register" && (
            <form onSubmit={handleRegister} className="space-y-5">
              {/* Error Alert */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="font-['Inter:Regular',sans-serif] text-[14px] text-red-700">{errors.submit}</p>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block font-['Inter:Medium',sans-serif] text-[15px] text-[#3b3b3b] mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8c8c8c]" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: "" });
                    }}
                    className={`w-full pl-12 pr-4 py-3.5 border rounded-xl font-['Inter:Regular',sans-serif] text-[16px] focus:outline-none focus:ring-2 transition-all ${
                      errors.name
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                        : "border-[#eaeaea] focus:border-[#1abc9c] focus:ring-[#1abc9c]/20"
                    }`}
                    placeholder="John Doe"
                    disabled={loading}
                  />
                </div>
                {errors.name && <p className="text-red-500 text-sm mt-1 font-['Inter:Regular',sans-serif]">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block font-['Inter:Medium',sans-serif] text-[15px] text-[#3b3b3b] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8c8c8c]" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                    className={`w-full pl-12 pr-4 py-3.5 border rounded-xl font-['Inter:Regular',sans-serif] text-[16px] focus:outline-none focus:ring-2 transition-all ${
                      errors.email
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                        : "border-[#eaeaea] focus:border-[#1abc9c] focus:ring-[#1abc9c]/20"
                    }`}
                    placeholder="you@example.com"
                    disabled={loading}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1 font-['Inter:Regular',sans-serif]">{errors.email}</p>}
              </div>

              {/* Phone (optional) */}
              <div>
                <label className="block font-['Inter:Medium',sans-serif] text-[15px] text-[#3b3b3b] mb-2">
                  Phone Number (optional)
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full pl-4 pr-4 py-3.5 border border-[#eaeaea] rounded-xl font-['Inter:Regular',sans-serif] text-[16px] focus:outline-none focus:border-[#1abc9c] focus:ring-2 focus:ring-[#1abc9c]/20 transition-all"
                  placeholder="+1 (555) 123-4567"
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block font-['Inter:Medium',sans-serif] text-[15px] text-[#3b3b3b] mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8c8c8c]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      if (errors.password) setErrors({ ...errors, password: "" });
                    }}
                    className={`w-full pl-12 pr-12 py-3.5 border rounded-xl font-['Inter:Regular',sans-serif] text-[16px] focus:outline-none focus:ring-2 transition-all ${
                      errors.password
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                        : "border-[#eaeaea] focus:border-[#1abc9c] focus:ring-[#1abc9c]/20"
                    }`}
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8c8c8c] hover:text-[#3b3b3b]"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1 font-['Inter:Regular',sans-serif]">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block font-['Inter:Medium',sans-serif] text-[15px] text-[#3b3b3b] mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8c8c8c]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      setFormData({ ...formData, confirmPassword: e.target.value });
                      if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" });
                    }}
                    className={`w-full pl-12 pr-12 py-3.5 border rounded-xl font-['Inter:Regular',sans-serif] text-[16px] focus:outline-none focus:ring-2 transition-all ${
                      errors.confirmPassword
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                        : "border-[#eaeaea] focus:border-[#1abc9c] focus:ring-[#1abc9c]/20"
                    }`}
                    placeholder="••••••••"
                    disabled={loading}
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1 font-['Inter:Regular',sans-serif]">{errors.confirmPassword}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1abc9c] text-white py-4 rounded-xl hover:bg-[#16a085] transition-colors font-['Inter:SemiBold',sans-serif] text-[16px] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account & Continue
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {/* Terms */}
              <p className="text-center font-['Inter:Regular',sans-serif] text-[13px] text-[#6b7280]">
                By creating an account, you agree to our{" "}
                <a href="#" className="text-[#1abc9c] hover:underline">Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="text-[#1abc9c] hover:underline">Privacy Policy</a>
              </p>
            </form>
          )}

          {/* Guest Checkout */}
          {activeTab === "guest" && (
            <div className="space-y-6">
              <div className="bg-[#f0fdf4] border border-[#1abc9c]/20 rounded-xl p-6">
                <h3 className="font-['Poppins:SemiBold',sans-serif] text-[18px] text-[#3b3b3b] mb-3">
                  Continue as Guest
                </h3>
                <p className="font-['Inter:Regular',sans-serif] text-[15px] text-[#6b7280] leading-6 mb-4">
                  You can complete your booking without creating an account. However, you'll need to provide your email to receive booking confirmation.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2 font-['Inter:Regular',sans-serif] text-[14px] text-[#6b7280]">
                    <span className="text-[#ef4444] text-[16px]">•</span>
                    <span>No saved booking history</span>
                  </li>
                  <li className="flex items-start gap-2 font-['Inter:Regular',sans-serif] text-[14px] text-[#6b7280]">
                    <span className="text-[#ef4444] text-[16px]">•</span>
                    <span>Cannot manage bookings online</span>
                  </li>
                  <li className="flex items-start gap-2 font-['Inter:Regular',sans-serif] text-[14px] text-[#6b7280]">
                    <span className="text-[#ef4444] text-[16px]">•</span>
                    <span>Must contact support for changes</span>
                  </li>
                </ul>
              </div>

              {/* Email for guest */}
              <div>
                <label className="block font-['Inter:Medium',sans-serif] text-[15px] text-[#3b3b3b] mb-2">
                  Email Address (for confirmation)
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8c8c8c]" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-3.5 border border-[#eaeaea] rounded-xl font-['Inter:Regular',sans-serif] text-[16px] focus:outline-none focus:border-[#1abc9c] focus:ring-2 focus:ring-[#1abc9c]/20 transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <button
                onClick={handleGuestContinue}
                className="w-full bg-[#1abc9c] text-white py-4 rounded-xl hover:bg-[#16a085] transition-colors font-['Inter:SemiBold',sans-serif] text-[16px] flex items-center justify-center gap-2"
              >
                Continue as Guest
                <ArrowRight className="w-5 h-5" />
              </button>

              {/* Recommendation */}
              <div className="text-center">
                <p className="font-['Inter:Regular',sans-serif] text-[14px] text-[#6b7280]">
                  We recommend creating an account for easier booking management
                </p>
              </div>
            </div>
          )}

          {/* Back to Booking */}
          <div className="mt-8 text-center">
            <Link
              to="/booking/step1"
              className="font-['Inter:Medium',sans-serif] text-[14px] text-[#6b7280] hover:text-[#1abc9c] transition-colors"
            >
              ← Back to Booking
            </Link>
          </div>

          {/* Staff Portal Link */}
          <div className="mt-6 pt-6 border-t border-[#eaeaea] text-center">
            <p className="font-['Inter:Regular',sans-serif] text-[13px] text-[#8c8c8c]">
              Are you a hotel partner?{' '}
              <Link
                to="/admin/login"
                className="font-['Inter:Medium',sans-serif] text-[#1abc9c] hover:text-[#16a085] transition-colors"
              >
                Staff Portal
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Benefits */}
      <div className="hidden lg:flex flex-1 bg-linear-to-br from-[#1abc9c] to-[#16a085] p-16 items-center justify-center">
        <div className="max-w-[480px]">
          <h2 className="font-['Poppins:Bold',sans-serif] text-[40px] leading-[52px] text-white mb-6">
            Why Create an Account?
          </h2>
          
          <div className="space-y-6">
            {[
              {
                title: "Manage All Bookings",
                description: "View, modify, or cancel your reservations anytime from one place"
              },
              {
                title: "Faster Checkout",
                description: "Save your details for quick bookings on your next visit"
              },
              {
                title: "Exclusive Deals",
                description: "Get access to member-only rates and special offers"
              },
              {
                title: "Booking History",
                description: "Keep track of all your past and upcoming hotel stays"
              },
              {
                title: "Easy Support",
                description: "Contact support instantly with your booking details readily available"
              }
            ].map((benefit, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="bg-white/20 w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-1">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-['Poppins:SemiBold',sans-serif] text-[18px] text-white mb-1">
                    {benefit.title}
                  </h3>
                  <p className="font-['Inter:Regular',sans-serif] text-[15px] text-white/90">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="font-['Inter:Regular',sans-serif] text-[16px] text-white/90 italic">
              "Creating an account made managing my Turkey bookings so much easier. Highly recommend!"
            </p>
            <p className="font-['Inter:SemiBold',sans-serif] text-[15px] text-white mt-3">
              — Sarah M., Verified Guest
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;