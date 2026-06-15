function Hero() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white">

            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-500 rounded-full blur-3xl"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-6 py-28">

                <div className="text-center">

                    <span className="inline-block px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm mb-6">
                        🚀 AI-Powered Customer Intelligence Platform
                    </span>

                    <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
                        Transform Customer
                        <span className="block bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
                            Reviews Into Insights
                        </span>
                    </h1>

                    <p className="mt-8 text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto">
                        Analyze customer sentiment, classify feedback, uncover trends,
                        and generate AI-powered recommendations that help businesses
                        make smarter decisions.
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">

                        <button className="px-8 py-4 rounded-xl bg-white text-slate-900 font-semibold hover:scale-105 transition duration-300">
                            Start Analyzing
                        </button>

                        <button className="px-8 py-4 rounded-xl border border-white/30 hover:bg-white/10 transition duration-300">
                            Watch Demo
                        </button>

                    </div>

                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">

                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                            <h3 className="text-3xl font-bold">95%</h3>
                            <p className="text-gray-300 mt-2">
                                Sentiment Accuracy
                            </p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                            <h3 className="text-3xl font-bold">1000+</h3>
                            <p className="text-gray-300 mt-2">
                                Reviews Processed
                            </p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                            <h3 className="text-3xl font-bold">24/7</h3>
                            <p className="text-gray-300 mt-2">
                                AI Monitoring
                            </p>
                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
}

export default Hero;