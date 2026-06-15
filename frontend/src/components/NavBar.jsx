import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-md border-b border-gray-200">

            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between">

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                        AI
                    </div>

                    <div>
                        <h1 className="text-xl font-bold text-gray-900">
                            Smart Review Analyzer
                        </h1>

                        <p className="text-xs text-gray-500">
                            AI-Powered Insights
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-6 mt-4 md:mt-0 text-gray-700 font-medium">

                    <Link
                        to="/"
                        className="hover:text-blue-600 transition duration-300"
                    >
                        Home
                    </Link>

                    <Link
                        to="/about"
                        className="hover:text-blue-600 transition duration-300"
                    >
                        About
                    </Link>

                    <Link
                        to="/dashboard"
                        className="hover:text-blue-600 transition duration-300"
                    >
                        Dashboard
                    </Link>

                    <Link
                        to="/login"
                        className="hover:text-blue-600 transition duration-300"
                    >
                        Login
                    </Link>

                </div>

                <button className="mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-lg hover:scale-105 transition">
                    Get Started
                </button>

            </div>

        </nav>
    );
}

export default Navbar;