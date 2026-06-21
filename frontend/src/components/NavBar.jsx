import { Link } from "react-router-dom";

function Navbar({ darkMode, setDarkMode }) {
    return (
        <nav
            className={`sticky top-0 z-50 backdrop-blur-md shadow-md border-b ${darkMode
                    ? "bg-gray-900 border-gray-700 text-white"
                    : "bg-white/90 border-gray-200 text-gray-900"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between">

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                        AI
                    </div>

                    <div>
                        <h1 className="text-xl font-bold">
                            Smart Review Analyzer
                        </h1>

                        <p className="text-xs opacity-70">
                            AI-Powered Insights
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-6 mt-4 md:mt-0 font-medium">
                    <Link to="/">Home</Link>
                    <Link to="/about">About</Link>
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/login">Login</Link>
                </div>

                <div className="flex gap-3 mt-4 md:mt-0">
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="bg-gray-700 text-white px-4 py-2 rounded-lg"
                    >
                        {darkMode ? "☀ Light" : "🌙 Dark"}
                    </button>

                    <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-lg">
                        Get Started
                    </button>
                </div>

            </div>
        </nav>
    );
}

export default Navbar;