import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

function Login({ darkMode, setDarkMode }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate successful login and go to dashboard
    navigate("/dashboard");
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    // Simulate successful sign up and auto login to dashboard
    navigate("/dashboard");
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
    }`}>
      <NavBar darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="flex items-center justify-center p-6 py-24">
        <div className="relative w-full max-w-md">
        {/* Logo/Brand */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-white font-extrabold text-xl shadow-xl shadow-amber-600/30 mb-3 hover:scale-110 transition-transform duration-300">
            AI
          </div>
          <h1 className="text-2xl font-black tracking-tight text-center">Smart Review Analyzer</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">AI-Powered Insights</p>
        </div>

        {/* Card */}
        <div className={`p-8 rounded-3xl border shadow-2xl transition-all duration-300 ${
          darkMode ? "bg-slate-900/80 border-slate-800 backdrop-blur-md" : "bg-white/80 border-slate-200/60 backdrop-blur-md"
        }`}>
          {/* Header depending on Login vs SignUp */}
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold tracking-tight">
              {isSignUp ? "Create an Account" : "Welcome Back!"}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              {isSignUp ? "Sign up to start analyzing reviews" : "Login to continue to your account"}
            </p>
          </div>

          {!isSignUp ? (
            /* LOGIN FORM */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`w-full px-4 py-3 rounded-2xl border transition-all duration-200 bg-slate-50/50 dark:bg-slate-950/50 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm ${
                    darkMode ? "border-slate-800 focus:border-amber-500 text-white" : "border-slate-200 focus:border-amber-500 text-slate-900"
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-2xl border transition-all duration-200 bg-slate-50/50 dark:bg-slate-950/50 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm ${
                    darkMode ? "border-slate-800 focus:border-amber-500 text-white" : "border-slate-200 focus:border-amber-500 text-slate-900"
                  }`}
                />
              </div>

              <div className="flex items-center justify-between text-sm py-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  />
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Remember me</span>
                </label>
                <a href="#" className="text-amber-600 hover:text-amber-500 dark:text-amber-400 dark:hover:text-amber-300 font-semibold">
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-2xl transition duration-200 shadow-lg shadow-amber-600/20 active:scale-[0.98] mt-2 text-sm cursor-pointer"
              >
                Login
              </button>
            </form>
          ) : (
            /* SIGNUP FORM */
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className={`w-full px-4 py-3 rounded-2xl border transition-all duration-200 bg-slate-50/50 dark:bg-slate-950/50 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm ${
                    darkMode ? "border-slate-800 focus:border-amber-500 text-white" : "border-slate-200 focus:border-amber-500 text-slate-900"
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`w-full px-4 py-3 rounded-2xl border transition-all duration-200 bg-slate-50/50 dark:bg-slate-950/50 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm ${
                    darkMode ? "border-slate-800 focus:border-amber-500 text-white" : "border-slate-200 focus:border-amber-500 text-slate-900"
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-2xl border transition-all duration-200 bg-slate-50/50 dark:bg-slate-950/50 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm ${
                    darkMode ? "border-slate-800 focus:border-amber-500 text-white" : "border-slate-200 focus:border-amber-500 text-slate-900"
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-2xl border transition-all duration-200 bg-slate-50/50 dark:bg-slate-950/50 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm ${
                    darkMode ? "border-slate-800 focus:border-amber-500 text-white" : "border-slate-200 focus:border-amber-500 text-slate-900"
                  }`}
                />
              </div>

              <div className="flex items-center text-sm py-1">
                <label className="flex items-start gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    required
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800 mt-0.5"
                  />
                  <span className="text-slate-600 dark:text-slate-400 font-medium">
                    I agree to the Terms of Service & Privacy Policy
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-2xl transition duration-200 shadow-lg shadow-amber-600/20 active:scale-[0.98] mt-2 text-sm cursor-pointer"
              >
                Sign Up
              </button>
            </form>
          )}

          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
            </div>
            <span className="relative bg-white dark:bg-slate-900 px-3 text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
              or
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className={`w-full font-bold py-3 px-4 rounded-2xl transition duration-200 border text-sm hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98] cursor-pointer ${
              darkMode ? "border-slate-800 text-slate-300" : "border-slate-200 text-slate-700"
            }`}
          >
            {isSignUp ? "Back to Login" : "Create New Account"}
          </button>
        </div>

        {/* Legal links */}
        <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
          By continuing, you agree to our{" "}
          <a href="#" className="underline font-semibold hover:text-slate-700 dark:hover:text-slate-300">Terms of Service</a> and{" "}
          <a href="#" className="underline font-semibold hover:text-slate-700 dark:hover:text-slate-300">Privacy Policy</a>.
        </p>
        </div>
      </div>
    </div>
  );
}

export default Login;