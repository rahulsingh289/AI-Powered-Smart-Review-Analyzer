import { useNavigate } from "react-router-dom";

function Hero({ darkMode }) {
  const navigate = useNavigate();

  return (
    <section className={`relative overflow-hidden transition-colors duration-300 ${
      darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"
    }`}>


      <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32 flex flex-col items-center">
        {/* Badge */}
        <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-8 border ${
          darkMode ? "bg-slate-900 border-slate-800 text-blue-400" : "bg-blue-50 border-blue-100 text-blue-600"
        }`}>
          <span>🚀</span> AI-Powered Customer Intelligence
        </span>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-center tracking-tight leading-[1.1] max-w-4xl">
          Transform Customer{" "}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-300 dark:to-violet-400">
            Reviews Into Insights
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className={`mt-8 text-base sm:text-xl text-center max-w-2xl leading-relaxed ${
          darkMode ? "text-slate-400" : "text-slate-600"
        }`}>
          Analyze customer sentiment, classify feedback, uncover trends, and generate AI-powered recommendations.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all text-center cursor-pointer"
          >
            Start Analyzing
          </button>
          <a
            href="#features"
            className={`px-8 py-4 rounded-2xl border font-bold text-base hover:bg-slate-100 dark:hover:bg-slate-900 active:scale-[0.98] transition-all text-center ${
              darkMode ? "border-slate-800 text-slate-300" : "border-slate-200 text-slate-700"
            }`}
          >
            Learn More
          </a>
        </div>

        {/* Hero Stats Grid */}
        <div className="mt-20 w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { value: "95%", label: "Sentiment Accuracy" },
            { value: "1000+", label: "Reviews Processed" },
            { value: "24/7", label: "AI Monitoring" }
          ].map((stat, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-3xl border text-center transition-all duration-300 hover:scale-[1.02] ${
                darkMode
                  ? "bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/60"
                  : "bg-white/80 border-slate-200/50 hover:shadow-lg hover:shadow-slate-100/50"
              }`}
            >
              <h3 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-300">
                {stat.value}
              </h3>
              <p className={`text-sm font-semibold mt-2 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;