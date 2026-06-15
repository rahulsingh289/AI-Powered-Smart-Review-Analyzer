function Footer() {
    return (
        <footer className="bg-slate-950 text-white">

            <div className="max-w-7xl mx-auto px-6 py-16">

                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

                    <div>
                        <h2 className="text-2xl font-bold">
                            AI Smart Review Analyzer
                        </h2>

                        <p className="mt-4 text-gray-400">
                            Transform customer reviews into actionable business insights
                            using advanced Artificial Intelligence.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">
                            Product
                        </h3>

                        <ul className="space-y-2 text-gray-400">
                            <li>Features</li>
                            <li>Analytics</li>
                            <li>Dashboard</li>
                            <li>Reports</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">
                            Resources
                        </h3>

                        <ul className="space-y-2 text-gray-400">
                            <li>Documentation</li>
                            <li>Guides</li>
                            <li>Support</li>
                            <li>Community</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">
                            Connect
                        </h3>

                        <div className="flex gap-4 text-gray-400">

                            <a href="#" className="hover:text-white transition">
                                Contact
                            </a>
                        </div>
                    </div>

                </div>

                <hr className="my-10 border-slate-800" />

                <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm gap-4">

                    <p>
                        © 2026 AI Smart Review Analyzer. All rights reserved.
                    </p>

                </div>

            </div>

        </footer>
    );
}

export default Footer;