import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useAuth, API_BASE_URL } from "../context/authContext";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

function Login({ darkMode, setDarkMode }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Status and Error states
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, register, loginWithOAuthToken } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // JWT Base64 Decoder helper
  const decodeToken = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Failed to decode token", e);
      return null;
    }
  };

  // Check URL query parameters for JWT on mount (OAuth Redirect callback)
  useEffect(() => {
    const token = searchParams.get("token");
    const err = searchParams.get("error");
    
    if (token) {
      const decodedUser = decodeToken(token);
      if (decodedUser) {
        setSuccess("Google Authentication successful! Logging you in...");
        setTimeout(() => {
          loginWithOAuthToken(token, decodedUser);
        }, 1500);
      }
    } else if (err) {
      setError("Google authentication failed. Please try again.");
    }
  }, [searchParams]);

  // Form Handlers
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setLoading(true);

    try {
      await login(email, password);
      setSuccess("Logged in successfully! Redirecting...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      setLoading(false);
      if (err.status === 429) {
        setError("Too many login attempts. Please try again after 15 minutes.");
      } else if (err.details) {
        setFieldErrors(err.details);
        setError("Please correct the errors below.");
      } else {
        setError(err.message || "Invalid credentials. Please try again.");
      }
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);
      setSuccess("Account registered successfully! Please log in to continue.");
      setLoading(false);
      setTimeout(() => {
        setPassword("");
        setConfirmPassword("");
        setIsSignUp(false);
        setSuccess("");
      }, 2000);
    } catch (err) {
      setLoading(false);
      if (err.status === 429) {
        setError("Too many registration attempts. Please try again after 15 minutes.");
      } else if (err.details) {
        setFieldErrors(err.details);
        setError("Please correct the errors below.");
      } else {
        setError(err.message || "Registration failed. Email might already be taken.");
      }
    }
  };

  // Google OAuth via Firebase popup
  const handleGoogleOAuth = async () => {
    setError("");
    setFieldErrors({});
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const response = await fetch(`${API_BASE_URL}/api/auth/google-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: user.email,
          name: user.displayName || user.email.split("@")[0],
          googleId: user.uid
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to log in with Google on backend");
      }

      setSuccess("Google Authentication successful! Logging you in...");
      setTimeout(() => {
        loginWithOAuthToken(data.token, data.user);
      }, 1000);
    } catch (err) {
      setLoading(false);
      if (err.code === "auth/popup-closed-by-user") {
        setError("Google sign-in popup was closed before completion.");
      } else {
        setError(err.message || "Google sign-in failed. Please try again.");
      }
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
    }`}>
      <NavBar darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="flex items-center justify-center p-6 py-20">
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
            
            {/* Status Messages */}
            {error && (
              <div className="mb-4 p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-500 text-xs font-semibold flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 text-xs font-semibold flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{success}</span>
              </div>
            )}

            {/* REGULAR LOGIN / SIGNUP FORMS */}
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
                      darkMode ? "border-slate-800 text-white" : "border-slate-200 text-slate-900"
                    }`}
                  />
                  {fieldErrors.email && (
                    <p className="text-red-500 text-xs mt-1 font-semibold">{fieldErrors.email[0]}</p>
                  )}
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
                      darkMode ? "border-slate-800 text-white" : "border-slate-200 text-slate-900"
                    }`}
                  />
                  {fieldErrors.password && (
                    <p className="text-red-500 text-xs mt-1 font-semibold">{fieldErrors.password[0]}</p>
                  )}
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
                  disabled={loading}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-2xl transition duration-200 shadow-lg shadow-amber-600/20 active:scale-[0.98] mt-2 text-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    "Login"
                  )}
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
                      darkMode ? "border-slate-800 text-white" : "border-slate-200 text-slate-900"
                    }`}
                  />
                  {fieldErrors.name && (
                    <p className="text-red-500 text-xs mt-1 font-semibold">{fieldErrors.name[0]}</p>
                  )}
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
                      darkMode ? "border-slate-800 text-white" : "border-slate-200 text-slate-900"
                    }`}
                  />
                  {fieldErrors.email && (
                    <p className="text-red-500 text-xs mt-1 font-semibold">{fieldErrors.email[0]}</p>
                  )}
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
                      darkMode ? "border-slate-800 text-white" : "border-slate-200 text-slate-900"
                    }`}
                  />
                  {fieldErrors.password && (
                    <p className="text-red-500 text-xs mt-1 font-semibold">{fieldErrors.password[0]}</p>
                  )}
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
                      darkMode ? "border-slate-800 text-white" : "border-slate-200 text-slate-900"
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
                  disabled={loading}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-2xl transition duration-200 shadow-lg shadow-amber-600/20 active:scale-[0.98] mt-2 text-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </form>
            )}

            {/* Divider */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
              </div>
              <span className="relative bg-white dark:bg-slate-900 px-3 text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
                or
              </span>
            </div>

            {/* Google OAuth (Full Width) */}
            <div className="mb-4">
              <button
                type="button"
                onClick={handleGoogleOAuth}
                className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border text-sm font-bold transition duration-200 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98] cursor-pointer ${
                  darkMode
                    ? "border-slate-800 text-slate-100 bg-slate-950/20"
                    : "border-slate-200 text-slate-800 bg-white"
                }`}
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign in with Google
              </button>
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