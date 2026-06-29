import { useState } from "react";
import Loader from "../components/ui/Loader";

function AnalyzeReviews({ darkMode }) {
  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState([]);

  // Send reviews to backend REST API to parse and store
  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    setResults([]);

    try {
      const response = await fetch("http://localhost:5001/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: inputText,
          tone: localStorage.getItem("settings_ai_tone") || "Professional",
          language: localStorage.getItem("settings_language") || "English"
        })
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        alert("Failed to analyze reviews. Make sure backend is running.");
      }
    } catch (error) {
      console.error("Error analyzing reviews:", error);
      alert("Error reaching the backend analysis engine.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setInputText("");
    setResults([]);
  };

  return (
    <div className="space-y-6">
      {/* Top Header info */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-xl font-extrabold mb-1">AI Review Analyzer</h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
          Paste guest reviews below and let AI analyze sentiment and themes in seconds.
        </p>
      </div>

      {/* Input area */}
      <div className={`p-6 rounded-3xl border space-y-4 ${
        darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
      }`}>
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Paste Reviews</label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type or paste reviews here (enter each review on a new line)..."
            rows="6"
            className={`w-full p-4 rounded-2xl border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
              darkMode
                ? "bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500"
                : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 shadow-inner"
            }`}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !inputText.trim()}
            className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            Analyze Reviews
          </button>
          
          <button
            onClick={handleClear}
            className={`px-6 py-3 rounded-2xl border font-bold text-sm hover:bg-slate-100 active:scale-[0.98] transition-all cursor-pointer ${
              darkMode ? "border-slate-800 text-slate-300 hover:bg-slate-800" : "border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Loader */}
      {isAnalyzing && (
        <div className="py-12">
          <Loader />
          <p className="text-center text-xs text-slate-500 dark:text-slate-400 font-medium animate-pulse">Processing reviews with AI NLP models...</p>
        </div>
      )}

      {/* Results table (displayed after analysis) */}
      {!isAnalyzing && results.length > 0 && (
        <div className={`rounded-3xl border overflow-hidden ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        }`}>
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-lg mb-1">Analyze Results</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Extracted sentiments, themes, and responses</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/20">
                  <th className="px-6 py-4">Reviews</th>
                  <th className="px-6 py-4">Sentiments</th>
                  <th className="px-6 py-4">Theme</th>
                  <th className="px-6 py-4">Suggested Response</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {results.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/30 transition-colors">
                    <td className="px-6 py-4 font-medium max-w-sm truncate text-slate-800 dark:text-slate-100">{item.text}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        item.sentiment === "Positive"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : item.sentiment === "Neutral"
                          ? "bg-blue-500/10 text-blue-500"
                          : "bg-rose-500/10 text-rose-500"
                      }`}>
                        {item.sentiment}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        darkMode ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"
                      }`}>
                        {item.theme}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 italic">
                      "{item.suggestedResponse}"
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalyzeReviews;
