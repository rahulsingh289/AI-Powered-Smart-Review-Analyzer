import { useState, useEffect } from "react";
import Loader from "../components/ui/Loader";

function Dashboard({ darkMode }) {
  const [stats, setStats] = useState(null);
  const [recentReviews, setRecentReviews] = useState([]);
  const [sentimentFilter, setSentimentFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // Fetch dashboard stats from backend REST API
  const fetchStats = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/reviews/stats");
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
      const response = await fetch(`http://localhost:5001/api/reviews?sentiment=${sentimentFilter}`);
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
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">Loading dashboard metrics...</p>
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
    "Food": "bg-emerald-500",
    "Host": "bg-blue-500",
    "Cleanliness": "bg-indigo-500",
    "Location": "bg-amber-500",
    "Facilities": "bg-purple-500",
    "Value": "bg-rose-500"
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
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Reviews</span>
          <h3 className="text-4xl font-black mt-2">{totalReviews}</h3>
          <p className="text-xs text-slate-500 mt-1">All time</p>
        </div>

        {/* Positive */}
        <div
          onClick={() => setSentimentFilter(sentimentFilter === "Positive" ? "All" : "Positive")}
          className={`p-6 rounded-3xl border transition-all duration-300 hover:shadow-lg cursor-pointer relative ${
            sentimentFilter === "Positive"
              ? "ring-2 ring-emerald-500 border-transparent bg-emerald-500/5"
              : darkMode
              ? "bg-slate-900 border-slate-800 hover:bg-slate-800"
              : "bg-white border-slate-200 hover:bg-slate-50"
          }`}
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Positive</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">{positivePercent}%</span>
          </div>
          <h3 className="text-4xl font-black mt-2 text-emerald-500">{positiveCount}</h3>
          <p className="text-xs text-slate-500 mt-1">Click to filter table</p>
        </div>

        {/* Neutral */}
        <div
          onClick={() => setSentimentFilter(sentimentFilter === "Neutral" ? "All" : "Neutral")}
          className={`p-6 rounded-3xl border transition-all duration-300 hover:shadow-lg cursor-pointer relative ${
            sentimentFilter === "Neutral"
              ? "ring-2 ring-blue-500 border-transparent bg-blue-500/5"
              : darkMode
              ? "bg-slate-900 border-slate-800 hover:bg-slate-800"
              : "bg-white border-slate-200 hover:bg-slate-50"
          }`}
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Neutral</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-bold">{neutralPercent}%</span>
          </div>
          <h3 className="text-4xl font-black mt-2 text-blue-500">{neutralCount}</h3>
          <p className="text-xs text-slate-500 mt-1">Click to filter table</p>
        </div>

        {/* Negative */}
        <div
          onClick={() => setSentimentFilter(sentimentFilter === "Negative" ? "All" : "Negative")}
          className={`p-6 rounded-3xl border transition-all duration-300 hover:shadow-lg cursor-pointer relative ${
            sentimentFilter === "Negative"
              ? "ring-2 ring-rose-500 border-transparent bg-rose-500/5"
              : darkMode
              ? "bg-slate-900 border-slate-800 hover:bg-slate-800"
              : "bg-white border-slate-200 hover:bg-slate-50"
          }`}
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Negative</span>
            <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 text-[10px] font-bold">{negativePercent}%</span>
          </div>
          <h3 className="text-4xl font-black mt-2 text-rose-500">{negativeCount}</h3>
          <p className="text-xs text-slate-500 mt-1">Click to filter table</p>
        </div>
      </div>

      {/* Main Split Layout: Sentiment Overview & Top Themes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sentiment Overview Chart mockup */}
        <div className={`lg:col-span-2 p-6 rounded-3xl border flex flex-col justify-between transition-all duration-300 hover:shadow-lg ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <div>
            <h3 className="font-bold text-lg mb-1">Sentiment Overview</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Visual sentiment distribution trends</p>
          </div>

          {/* Styled chart visualizer */}
          <div className="my-8 space-y-6">
            {/* Multi-segment progress bar */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span>Visual Breakdown</span>
                <span className="text-slate-500 dark:text-slate-400">Positive / Neutral / Negative</span>
              </div>
              <div className="w-full h-8 rounded-2xl overflow-hidden flex shadow-inner">
                <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${positivePercent}%` }} title={`Positive: ${positivePercent}%`}></div>
                <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${neutralPercent}%` }} title={`Neutral: ${neutralPercent}%`}></div>
                <div className="bg-rose-500 h-full transition-all duration-500" style={{ width: `${negativePercent}%` }} title={`Negative: ${negativePercent}%`}></div>
              </div>
            </div>

            {/* Labels under the bar */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-medium">
              <div
                onClick={() => setSentimentFilter(sentimentFilter === "Positive" ? "All" : "Positive")}
                className={`p-3 rounded-2xl border cursor-pointer hover:scale-[1.02] transition ${
                  sentimentFilter === "Positive" ? "border-emerald-500 bg-emerald-500/5" : "border-slate-100 dark:border-slate-800/80"
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mx-auto mb-1.5"></div>
                <div className="font-bold text-slate-500 dark:text-slate-400">Positive</div>
                <div className="text-base font-black text-emerald-500 mt-0.5">{positivePercent}%</div>
              </div>
              <div
                onClick={() => setSentimentFilter(sentimentFilter === "Neutral" ? "All" : "Neutral")}
                className={`p-3 rounded-2xl border cursor-pointer hover:scale-[1.02] transition ${
                  sentimentFilter === "Neutral" ? "border-blue-500 bg-blue-500/5" : "border-slate-100 dark:border-slate-800/80"
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mx-auto mb-1.5"></div>
                <div className="font-bold text-slate-500 dark:text-slate-400">Neutral</div>
                <div className="text-base font-black text-blue-500 mt-0.5">{neutralPercent}%</div>
              </div>
              <div
                onClick={() => setSentimentFilter(sentimentFilter === "Negative" ? "All" : "Negative")}
                className={`p-3 rounded-2xl border cursor-pointer hover:scale-[1.02] transition ${
                  sentimentFilter === "Negative" ? "border-rose-500 bg-rose-500/5" : "border-slate-100 dark:border-slate-800/80"
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 mx-auto mb-1.5"></div>
                <div className="font-bold text-slate-500 dark:text-slate-400">Negative</div>
                <div className="text-base font-black text-rose-500 mt-0.5">{negativePercent}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Themes Progress Bars */}
        <div className={`p-6 rounded-3xl border flex flex-col justify-between transition-all duration-300 hover:shadow-lg ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <div>
            <h3 className="font-bold text-lg mb-1">Top Themes</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Most discussed aspects</p>
          </div>

          <div className="my-6 space-y-4">
            {topThemes.map((theme) => {
              const barColor = themeColors[theme.name] || "bg-slate-400";
              return (
                <div key={theme.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-600 dark:text-slate-300">{theme.name}</span>
                    <span className="text-slate-500 dark:text-slate-400">{theme.percentage}%</span>
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
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg mb-1">Recent Reviews</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Latest analyzed customer comments</p>
          </div>
          
          {/* Table Filters (Quick Action tabs) */}
          <div className="flex gap-1.5 p-1 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 w-fit">
            {["All", "Positive", "Neutral", "Negative"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSentimentFilter(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  sentimentFilter === tab
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
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
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/20">
                <th className="px-6 py-4">Reviews</th>
                <th className="px-6 py-4">Sentiment</th>
                <th className="px-6 py-4">Theme</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {recentReviews.length > 0 ? (
                recentReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/30 transition-colors">
                    <td className="px-6 py-4 font-medium max-w-sm truncate text-slate-800 dark:text-slate-100">{review.text}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        review.sentiment === "Positive"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : review.sentiment === "Neutral"
                          ? "bg-blue-500/10 text-blue-500"
                          : "bg-rose-500/10 text-rose-500"
                      }`}>
                        {review.sentiment}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        darkMode ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"
                      }`}>
                        {review.theme}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap">{review.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
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