import { useState, useEffect } from "react";
import Loader from "../components/ui/Loader";
import { useAuth } from "../context/authContext";

function Dashboard({ darkMode }) {
  const { apiFetch } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentReviews, setRecentReviews] = useState([]);
  const [sentimentFilter, setSentimentFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // Fetch dashboard stats from backend REST API
  const fetchStats = async () => {
    try {
      const response = await apiFetch("/api/reviews/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Fetch filtered reviews from backend REST API
  const fetchReviews = async () => {
    try {
      const response = await apiFetch(`/api/reviews?sentiment=${sentimentFilter}`);
      if (response.ok) {
        const data = await response.json();
        setRecentReviews(data.slice(0, 5)); // Limit to top 5 recent reviews for dashboard
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  // Resolve API calls on mount and filter changes
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchReviews()]);
      setLoading(false);
    };
    loadData();
  }, [sentimentFilter]);

  if (loading && !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader />
        <p className={`text-sm font-medium mt-2 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Loading dashboard metrics...</p>
      </div>
    );
  }

  // Fallbacks if stats fail or empty
  const totalReviews = stats?.totalReviews || 0;
  const positivePercent = stats?.positivePercent || 0;
  const neutralPercent = stats?.neutralPercent || 0;
  const negativePercent = stats?.negativePercent || 0;
  const positiveCount = stats?.positiveCount || 0;
  const neutralCount = stats?.neutralCount || 0;
  const negativeCount = stats?.negativeCount || 0;

  // Themes list from backend or fallbacks
  const themeColors = {
    "Food": "bg-amber-500",
    "Host": "bg-indigo-500",
    "Cleanliness": "bg-cyan-500",
    "Location": "bg-purple-500",
    "Facilities": "bg-violet-500",
    "Value": "bg-emerald-500"
  };

  const topThemes = stats?.topThemes && stats.topThemes.length > 0
    ? stats.topThemes
    : [
        { name: "Food", percentage: 40 },
        { name: "Host", percentage: 35 },
        { name: "Cleanliness", percentage: 25 },
        { name: "Location", percentage: 20 }
      ];

  return (
    <div className="space-y-6">
      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Reviews */}
        <div className={`p-6 rounded-3xl border transition-all duration-300 hover:shadow-lg ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <span className={`text-xs font-bold uppercase tracking-wider ${
            darkMode ? "text-slate-400" : "text-slate-600"
          }`}>Total Reviews</span>
          <h3 className={`text-4xl font-black mt-2 ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{totalReviews}</h3>
          <p className={`text-xs font-medium mt-1 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>All time</p>
        </div>

        {/* Positive */}
        <div
          onClick={() => setSentimentFilter(sentimentFilter === "Positive" ? "All" : "Positive")}
          className={`p-6 rounded-3xl border transition-all duration-300 hover:shadow-lg cursor-pointer relative ${
            sentimentFilter === "Positive"
              ? darkMode
                ? "ring-2 ring-emerald-500 border-emerald-500/50 bg-emerald-500/10"
                : "ring-2 ring-emerald-500 border-transparent bg-emerald-50"
              : darkMode
              ? "bg-slate-900 border-slate-800 hover:bg-slate-800/80"
              : "bg-white border-slate-200 hover:bg-slate-50"
          }`}
        >
          <div className="flex justify-between items-start">
            <span className={`text-xs font-bold uppercase tracking-wider ${
              darkMode ? "text-slate-400" : "text-slate-600"
            }`}>Positive</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              darkMode ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-700"
            }`}>{positivePercent}%</span>
          </div>
          <h3 className={`text-4xl font-black mt-2 ${
            darkMode ? "text-emerald-400" : "text-emerald-600"
          }`}>{positiveCount}</h3>
          <p className={`text-xs font-medium mt-1 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Click to filter table</p>
        </div>

        {/* Neutral */}
        <div
          onClick={() => setSentimentFilter(sentimentFilter === "Neutral" ? "All" : "Neutral")}
          className={`p-6 rounded-3xl border transition-all duration-300 hover:shadow-lg cursor-pointer relative ${
            sentimentFilter === "Neutral"
              ? darkMode
                ? "ring-2 ring-indigo-500 border-indigo-500/50 bg-indigo-500/10"
                : "ring-2 ring-indigo-500 border-transparent bg-indigo-50"
              : darkMode
              ? "bg-slate-900 border-slate-800 hover:bg-slate-800/80"
              : "bg-white border-slate-200 hover:bg-slate-50"
          }`}
        >
          <div className="flex justify-between items-start">
            <span className={`text-xs font-bold uppercase tracking-wider ${
              darkMode ? "text-slate-400" : "text-slate-600"
            }`}>Neutral</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              darkMode ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-100 text-indigo-600"
            }`}>{neutralPercent}%</span>
          </div>
          <h3 className={`text-4xl font-black mt-2 ${
            darkMode ? "text-indigo-400" : "text-indigo-600"
          }`}>{neutralCount}</h3>
          <p className={`text-xs font-medium mt-1 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Click to filter table</p>
        </div>

        {/* Negative */}
        <div
          onClick={() => setSentimentFilter(sentimentFilter === "Negative" ? "All" : "Negative")}
          className={`p-6 rounded-3xl border transition-all duration-300 hover:shadow-lg cursor-pointer relative ${
            sentimentFilter === "Negative"
              ? darkMode
                ? "ring-2 ring-rose-500 border-rose-500/50 bg-rose-500/10"
                : "ring-2 ring-rose-500 border-transparent bg-rose-50"
              : darkMode
              ? "bg-slate-900 border-slate-800 hover:bg-slate-800/80"
              : "bg-white border-slate-200 hover:bg-slate-50"
          }`}
        >
          <div className="flex justify-between items-start">
            <span className={`text-xs font-bold uppercase tracking-wider ${
              darkMode ? "text-slate-400" : "text-slate-600"
            }`}>Negative</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              darkMode ? "bg-rose-500/20 text-rose-400" : "bg-rose-100 text-rose-600"
            }`}>{negativePercent}%</span>
          </div>
          <h3 className={`text-4xl font-black mt-2 ${
            darkMode ? "text-rose-400" : "text-rose-600"
          }`}>{negativeCount}</h3>
          <p className={`text-xs font-medium mt-1 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Click to filter table</p>
        </div>
      </div>

      {/* Main Split Layout: Sentiment Overview & Top Themes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sentiment Overview Chart mockup */}
        <div className={`lg:col-span-2 p-6 rounded-3xl border flex flex-col justify-between transition-all duration-300 hover:shadow-lg ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <div>
            <h3 className={`font-bold text-lg mb-1 ${darkMode ? "text-slate-100" : "text-slate-900"}`}>Sentiment Overview</h3>
            <p className={`text-xs font-medium ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Visual sentiment distribution trends</p>
          </div>

          {/* Styled chart visualizer */}
          <div className="my-8 space-y-6">
            {/* Multi-segment progress bar */}
            <div>
              <div className={`flex justify-between text-xs font-semibold mb-2 ${
                darkMode ? "text-slate-300" : "text-slate-700"
              }`}>
                <span>Visual Breakdown</span>
                <span className={darkMode ? "text-slate-400" : "text-slate-600"}>Positive / Neutral / Negative</span>
              </div>
              <div className={`w-full h-8 rounded-2xl overflow-hidden flex ${
                darkMode ? "bg-slate-800/50" : "bg-slate-100"
              }`}>
                <div className={`h-full transition-all duration-500 ${
                  darkMode ? "bg-emerald-500/80" : "bg-emerald-500"
                }`} style={{ width: `${positivePercent}%` }} title={`Positive: ${positivePercent}%`}></div>
                <div className={`h-full transition-all duration-500 ${
                  darkMode ? "bg-slate-500/80" : "bg-slate-400"
                }`} style={{ width: `${neutralPercent}%` }} title={`Neutral: ${neutralPercent}%`}></div>
                <div className={`h-full transition-all duration-500 ${
                  darkMode ? "bg-rose-500/80" : "bg-rose-500"
                }`} style={{ width: `${negativePercent}%` }} title={`Negative: ${negativePercent}%`}></div>
              </div>
            </div>

            {/* Labels under the bar */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-medium">
              <div
                onClick={() => setSentimentFilter(sentimentFilter === "Positive" ? "All" : "Positive")}
                className={`p-3 rounded-2xl border cursor-pointer hover:scale-[1.02] transition ${
                  sentimentFilter === "Positive" 
                    ? darkMode
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-emerald-500 bg-emerald-50" 
                    : darkMode
                    ? "border-slate-800 hover:bg-slate-800/50"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mx-auto mb-1.5"></div>
                <div className={`font-bold ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Positive</div>
                <div className={`text-base font-black mt-0.5 ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}>{positivePercent}%</div>
              </div>
              <div
                onClick={() => setSentimentFilter(sentimentFilter === "Neutral" ? "All" : "Neutral")}
                className={`p-3 rounded-2xl border cursor-pointer hover:scale-[1.02] transition ${
                  sentimentFilter === "Neutral" 
                    ? darkMode
                      ? "border-slate-500 bg-slate-500/10"
                      : "border-slate-400 bg-slate-50" 
                    : darkMode
                    ? "border-slate-800 hover:bg-slate-800/50"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className={`w-2.5 h-2.5 rounded-full mx-auto mb-1.5 ${darkMode ? "bg-slate-500" : "bg-slate-400"}`}></div>
                <div className={`font-bold ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Neutral</div>
                <div className={`text-base font-black mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>{neutralPercent}%</div>
              </div>
              <div
                onClick={() => setSentimentFilter(sentimentFilter === "Negative" ? "All" : "Negative")}
                className={`p-3 rounded-2xl border cursor-pointer hover:scale-[1.02] transition ${
                  sentimentFilter === "Negative" 
                    ? darkMode
                      ? "border-rose-500 bg-rose-500/10"
                      : "border-rose-500 bg-rose-50" 
                    : darkMode
                    ? "border-slate-800 hover:bg-slate-800/50"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 mx-auto mb-1.5"></div>
                <div className={`font-bold ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Negative</div>
                <div className={`text-base font-black mt-0.5 ${darkMode ? "text-rose-400" : "text-rose-600"}`}>{negativePercent}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Themes Progress Bars */}
        <div className={`p-6 rounded-3xl border flex flex-col justify-between transition-all duration-300 hover:shadow-lg ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <div>
            <h3 className={`font-bold text-lg mb-1 ${darkMode ? "text-slate-100" : "text-slate-900"}`}>Top Themes</h3>
            <p className={`text-xs font-medium ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Most discussed aspects</p>
          </div>

          <div className="my-6 space-y-4">
            {topThemes.map((theme) => {
              const barColor = themeColors[theme.name] || "bg-slate-400";
              return (
                <div key={theme.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className={darkMode ? "text-slate-300" : "text-slate-700"}>{theme.name}</span>
                    <span className={darkMode ? "text-slate-400" : "text-slate-600"}>{theme.percentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${theme.percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Reviews Table */}
      <div className={`rounded-3xl border overflow-hidden transition-all duration-300 hover:shadow-lg ${
        darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
      }`}>
        <div className={`p-6 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
          darkMode ? "border-slate-800" : "border-slate-200"
        }`}>
          <div>
            <h3 className={`font-bold text-lg mb-1 ${darkMode ? "text-slate-100" : "text-slate-900"}`}>Recent Reviews</h3>
            <p className={`text-xs font-medium ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Latest analyzed customer comments</p>
          </div>
          
          {/* Table Filters (Quick Action tabs) */}
          <div className={`flex gap-1.5 p-1 rounded-2xl border w-fit ${
            darkMode 
              ? "bg-slate-950 border-slate-800" 
              : "bg-slate-100 border-slate-200"
          }`}>
            {["All", "Positive", "Neutral", "Negative"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSentimentFilter(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  sentimentFilter === tab
                    ? darkMode
                      ? "bg-amber-600 text-white shadow-sm"
                      : "bg-amber-600 text-white shadow-md"
                    : darkMode
                    ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-xs font-bold uppercase tracking-wider ${
                darkMode 
                  ? "border-slate-800 text-slate-400 bg-slate-900/50" 
                  : "border-slate-200 text-slate-600 bg-slate-50"
              }`}>
                <th className="px-6 py-4">Reviews</th>
                <th className="px-6 py-4">Sentiment</th>
                <th className="px-6 py-4">Theme</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-sm ${
              darkMode ? "divide-slate-800" : "divide-slate-200"
            }`}>
              {recentReviews.length > 0 ? (
                recentReviews.map((review) => (
                  <tr key={review.id} className={`transition-colors ${
                    darkMode ? "hover:bg-slate-800/50" : "hover:bg-slate-50"
                  }`}>
                    <td className={`px-6 py-4 font-medium max-w-sm truncate ${
                      darkMode ? "text-slate-200" : "text-slate-800"
                    }`}>{review.text}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        review.sentiment === "Positive"
                          ? darkMode 
                            ? "bg-emerald-500/15 text-emerald-400" 
                            : "bg-emerald-100 text-emerald-700"
                          : review.sentiment === "Neutral"
                          ? darkMode 
                            ? "bg-indigo-500/15 text-indigo-400" 
                            : "bg-indigo-100 text-indigo-700"
                          : darkMode 
                            ? "bg-rose-500/15 text-rose-400" 
                            : "bg-rose-100 text-rose-700"
                      }`}>
                        {review.sentiment}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        darkMode ? "bg-slate-800 text-slate-300" : "bg-slate-200 text-slate-700"
                      }`}>
                        {review.theme}
                      </span>
                    </td>
                    <td className={`px-6 py-4 font-semibold text-xs whitespace-nowrap ${
                      darkMode ? "text-slate-400" : "text-slate-600"
                    }`}>{review.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className={`px-6 py-8 text-center text-sm font-medium ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}>
                    No recent reviews found matching the filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;