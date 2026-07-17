import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar({ darkMode, setDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={`sticky top-0 z-50 border-b backdrop-blur-md transition-all duration-300 ${
      darkMode ? "bg-slate-900/95 border-slate-800 text-slate-100" : "bg-white/95 border-slate-200 text-slate-900"
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-white font-extrabold shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200">
            AI
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight leading-none">Smart Review Analyzer</h1>
            <span className="text-[10px] opacity-70 font-semibold tracking-wide uppercase">AI-Powered Insights</span>
          </div>
        </Link>

        {/* Desktop Menu Links */}
        <div className="hidden md:flex items-center gap-8 font-semibold text-sm">
          <Link to="/" className={`transition-colors ${darkMode ? "hover:text-amber-400" : "hover:text-amber-600"}`}>Home</Link>
          <Link to="/about" className={`transition-colors ${darkMode ? "hover:text-amber-400" : "hover:text-amber-600"}`}>About</Link>
          <Link to="/dashboard" className={`transition-colors ${darkMode ? "hover:text-amber-400" : "hover:text-amber-600"}`}>Dashboard</Link>
          <Link to="/login" className={`transition-colors ${darkMode ? "hover:text-amber-400" : "hover:text-amber-600"}`}>Login</Link>
        </div>

        {/* Right side Actions */}
        <div className="flex items-center gap-3">
          {/* Light/Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2.5 rounded-xl transition-all duration-200 border cursor-pointer ${
              darkMode
                ? "bg-slate-800 border-slate-700 hover:bg-slate-700 text-amber-400 hover:text-amber-300"
                : "bg-slate-100 border-slate-200 hover:bg-slate-200 text-indigo-600 hover:text-indigo-700 shadow-sm"
            }`}
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Desktop Get Started Button */}
          <Link
            to="/login"
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-md shadow-amber-500/20 active:scale-[0.98] transition-all"
          >
            Get Started
          </Link>

          {/* Hamburger Menu Toggle (Visible on mobile/tablet) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`p-2.5 rounded-xl md:hidden border cursor-pointer transition-colors duration-200 ${
              darkMode ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700" : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 shadow-sm"
            }`}
            aria-label="Toggle Navigation Menu"
          >
            {isOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel (Slide-down menu) */}
      {isOpen && (
        <div className={`md:hidden border-t px-6 py-4 space-y-4 ${
          darkMode ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-700 shadow-inner"
        }`}>
          <div className="flex flex-col gap-4 font-semibold text-sm">
            <Link to="/" onClick={() => setIsOpen(false)} className={`py-2 transition-colors ${darkMode ? "hover:text-amber-400" : "hover:text-amber-600"}`}>Home</Link>
            <Link to="/about" onClick={() => setIsOpen(false)} className={`py-2 transition-colors ${darkMode ? "hover:text-amber-400" : "hover:text-amber-600"}`}>About</Link>
            <Link to="/dashboard" onClick={() => setIsOpen(false)} className={`py-2 transition-colors ${darkMode ? "hover:text-amber-400" : "hover:text-amber-600"}`}>Dashboard</Link>
            <Link to="/login" onClick={() => setIsOpen(false)} className={`py-2 transition-colors ${darkMode ? "hover:text-amber-400" : "hover:text-amber-600"}`}>Login</Link>
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="inline-flex sm:hidden items-center justify-center px-5 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-md"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;