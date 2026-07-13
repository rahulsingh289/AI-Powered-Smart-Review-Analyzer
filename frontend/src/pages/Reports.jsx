import { useState, useEffect } from "react";
import Loader from "../components/ui/Loader";
import { useAuth } from "../context/authContext";

function Reports({ darkMode }) {
  const { apiFetch } = useAuth();
  const [dateRange, setDateRange] = useState("30-days");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Loading states for reports download to improve UX
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [exportingCSV, setExportingCSV] = useState(false);
  const [successToast, setSuccessToast] = useState("");

  // Fetch all reviews from backend API to compute live report stats
  const fetchAllReviews = async () => {
    try {
      const response = await apiFetch("/api/reviews");
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error("Error fetching reviews for reports:", error);
    }
  };

  useEffect(() => {
    const loadReports = async () => {
      setLoading(true);
      await fetchAllReviews();
      setLoading(false);
    };
    loadReports();
  }, []);

  const parseDate = (dateStr) => {
    if (!dateStr) return new Date(0);
    const cleaned = dateStr.replace(/\./g, '');
    const d = new Date(cleaned);
    return isNaN(d.getTime()) ? new Date(0) : d;
  };

  const getFilteredReviews = () => {
    if (dateRange === "all-time") return reviews;

    const now = new Date();
    now.setHours(23, 59, 59, 999);

    let cutoff = new Date(now);

    if (dateRange === "7-days") {
      cutoff.setDate(now.getDate() - 7);
      cutoff.setHours(0, 0, 0, 0);
    } else if (dateRange === "30-days") {
      cutoff.setDate(now.getDate() - 30);
      cutoff.setHours(0, 0, 0, 0);
    } else if (dateRange === "3-months") {
      cutoff.setMonth(now.getMonth() - 3);
      cutoff.setHours(0, 0, 0, 0);
    }

    return reviews.filter(r => {
      const reviewDate = parseDate(r.date);
      return reviewDate >= cutoff && reviewDate <= now;
    });
  };

  const filteredReviews = getFilteredReviews();

  // Dynamic calculations based on live database reviews
  const totalReviews = filteredReviews.length;
  
  // 1. NSS Score = ((Positives - Negatives) / Total) * 100
  const positiveCount = filteredReviews.filter(r => r.sentiment === "Positive").length;
  const negativeCount = filteredReviews.filter(r => r.sentiment === "Negative").length;
  const nssScore = totalReviews > 0 
    ? parseFloat((((positiveCount - negativeCount) / totalReviews) * 100).toFixed(1))
    : 0;

  // 2. Calculate Top Themes & Drivers dynamically
  const positiveThemeCounts = {};
  const negativeThemeCounts = {};

  filteredReviews.forEach(r => {
    const parts = r.theme.split("/");
    parts.forEach(p => {
      if (r.sentiment === "Positive") {
        positiveThemeCounts[p] = (positiveThemeCounts[p] || 0) + 1;
      } else if (r.sentiment === "Negative") {
        negativeThemeCounts[p] = (negativeThemeCounts[p] || 0) + 1;
      }
    });
  });

  // Find positive topic driver
  const sortedPositiveThemes = Object.keys(positiveThemeCounts).sort(
    (a, b) => positiveThemeCounts[b] - positiveThemeCounts[a]
  );
  const topTopic = sortedPositiveThemes.length > 0 ? sortedPositiveThemes[0] : "None";

  // Find negative topic driver
  const sortedNegativeThemes = Object.keys(negativeThemeCounts).sort(
    (a, b) => negativeThemeCounts[b] - negativeThemeCounts[a]
  );
  const negativeDriver = sortedNegativeThemes.length > 0 ? sortedNegativeThemes[0] : "None";

  // Format NSS visual progress bar percentage (converts -100..100 range to 0..100%)
  const nssProgressWidth = `${Math.min(Math.max(((nssScore + 100) / 2), 0), 100)}%`;

  const handleDownloadPDF = () => {
    setDownloadingPDF(true);
    setTimeout(() => {
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        alert("Please allow popups to generate PDF reports.");
        setDownloadingPDF(false);
        return;
      }
      
      const themeCounts = {};
      filteredReviews.forEach(r => {
        const parts = r.theme.split("/");
        parts.forEach(p => {
          themeCounts[p] = (themeCounts[p] || 0) + 1;
        });
      });
      const themeListHTML = Object.entries(themeCounts)
        .map(([name, count]) => `<li><strong>${name}</strong>: ${count} occurrences (${Math.round((count / Math.max(1, filteredReviews.length)) * 100)}%)</li>`)
        .join("");

      const reviewsListHTML = filteredReviews
        .map(r => `
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 8px; white-space: nowrap;">${r.date}</td>
            <td style="padding: 8px;"><strong>${r.sentiment}</strong></td>
            <td style="padding: 8px;">${r.theme}</td>
            <td style="padding: 8px;">${r.text}</td>
          </tr>
        `)
        .join("");

      printWindow.document.write(`
        <html>
          <head>
            <title>AI Review Analyzer - Executive Summary Report</title>
            <style>
              body { font-family: 'Plus Jakarta Sans', Arial, sans-serif; color: #333; margin: 40px; line-height: 1.6; }
              h1 { color: #1e3a8a; border-bottom: 2px solid #1e3a8a; padding-bottom: 10px; font-size: 24px; }
              h2 { color: #2563eb; font-size: 18px; margin-top: 30px; }
              .metrics { display: flex; justify-content: space-between; margin: 20px 0; background: #f3f4f6; padding: 20px; border-radius: 12px; }
              .metric-card { text-align: center; flex: 1; }
              .metric-value { font-size: 24px; font-weight: bold; color: #1e3a8a; margin-top: 5px; }
              table { width: 100%; border-collapse: collapse; margin-top: 15px; }
              th { background-color: #f3f4f6; text-align: left; padding: 8px; font-size: 14px; }
              td { font-size: 13px; }
            </style>
          </head>
          <body>
            <h1>AI-Powered Smart Review Analyzer - Executive Summary</h1>
            <p><strong>Report Range:</strong> ${dateRange.toUpperCase().replace("-", " ")}</p>
            <p><strong>Date Generated:</strong> ${new Date().toLocaleDateString('en-GB')}</p>
            
            <div class="metrics">
              <div class="metric-card">
                <div>Total Reviews</div>
                <div class="metric-value">${filteredReviews.length}</div>
              </div>
              <div class="metric-card">
                <div>Net Sentiment Score (NSS)</div>
                <div class="metric-value" style="color: ${nssScore >= 0 ? '#10b981' : '#ef4444'}">${nssScore >= 0 ? '+' : ''}${nssScore}</div>
              </div>
              <div class="metric-card">
                <div>Positive / Negative Drivers</div>
                <div class="metric-value" style="font-size: 16px; color: #2563eb;">${topTopic} / ${negativeDriver}</div>
              </div>
            </div>

            <h2>Theme Breakdown</h2>
            <ul>
              ${themeListHTML || "<li>No data available</li>"}
            </ul>

            <h2>Analyzed Reviews List</h2>
            <table>
              <thead>
                <tr>
                  <th style="width: 15%">Date</th>
                  <th style="width: 15%">Sentiment</th>
                  <th style="width: 15%">Theme</th>
                  <th style="width: 55%">Review Text</th>
                </tr>
              </thead>
              <tbody>
                ${reviewsListHTML || "<tr><td colspan='4' style='text-align:center; padding: 20px;'>No reviews found in this range.</td></tr>"}
              </tbody>
            </table>

            <script>
              window.onload = function() {
                window.print();
                window.close();
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
      
      setDownloadingPDF(false);
      setSuccessToast("PDF Executive Report generated!");
      setTimeout(() => setSuccessToast(""), 3000);
    }, 1500);
  };

  const handleExportCSV = () => {
    setExportingCSV(true);
    setTimeout(() => {
      if (filteredReviews.length === 0) {
        alert("No reviews available in this date range to export.");
        setExportingCSV(false);
        return;
      }
      
      // Generate CSV content
      const headers = ["ID", "Review Text", "Sentiment", "Theme", "Date", "Suggested Response"];
      const csvRows = [
        headers.join(","),
        ...filteredReviews.map(r => [
          r.id,
          `"${r.text.replace(/"/g, '""')}"`,
          `"${r.sentiment}"`,
          `"${r.theme}"`,
          `"${r.date}"`,
          `"${(r.suggestedResponse || "").replace(/"/g, '""')}"`
        ].join(","))
      ];
      
      const csvContent = "\uFEFF" + csvRows.join("\n"); // Add UTF-8 BOM
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const encodedUrl = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.setAttribute("href", encodedUrl);
      link.setAttribute("download", `AI_Review_Analyzer_Report_${dateRange}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setExportingCSV(false);
      setSuccessToast("CSV Data exported successfully!");
      setTimeout(() => setSuccessToast(""), 3000);
    }, 1500);
  };

  // Mock list of historic generated reports
  const reportHistory = [
    { id: "REP-2026-004", name: "May Sentiment Analysis", date: "June 1, 2026", format: "PDF", size: "2.4 MB" },
    { id: "REP-2026-003", name: "Q1 Facilities Feedback Summary", date: "May 15, 2026", format: "CSV", size: "112 KB" },
    { id: "REP-2026-002", name: "Cleanliness Audit - April", date: "May 1, 2026", format: "PDF", size: "1.9 MB" }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader />
        <p className={`text-sm font-medium mt-2 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Analyzing reports...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast popup */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-lg font-semibold text-sm flex items-center gap-2 animate-bounce">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          {successToast}
        </div>
      )}

      {/* Header Info with Date range selector */}
      <div className={`p-6 rounded-3xl border shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
        darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
      }`}>
        <div>
          <h2 className={`text-xl font-bold mb-1 ${darkMode ? "text-slate-100" : "text-slate-900"}`}>Analytics Reports</h2>
          <p className={`text-xs sm:text-sm font-medium ${
            darkMode ? "text-slate-400" : "text-slate-600"
          }`}>
            Configure parameters and download comprehensive review analysis logs.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold uppercase tracking-wider whitespace-nowrap ${
            darkMode ? "text-slate-400" : "text-slate-600"
          }`}>Range:</span>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className={`px-3 py-2 rounded-xl border text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
              darkMode ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-200 text-slate-700 shadow-sm"
            }`}
          >
            <option value="7-days">Last 7 Days</option>
            <option value="30-days">Last 30 Days</option>
            <option value="3-months">Last 3 Months</option>
            <option value="all-time">All Time</option>
          </select>
        </div>
      </div>

      {/* KPI Cards for Report preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-3xl border ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <span className={`text-xs font-bold uppercase tracking-wider ${
            darkMode ? "text-slate-400" : "text-slate-600"
          }`}>Net Sentiment Score (NSS)</span>
          <h3 className={`text-3xl font-black mt-2 ${nssScore >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
            {nssScore >= 0 ? `+${nssScore}` : nssScore}
          </h3>
          <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mt-3">
            <div className={`h-full ${nssScore >= 0 ? "bg-emerald-500" : "bg-rose-500"}`} style={{ width: nssProgressWidth }}></div>
          </div>
          <p className={`text-[10px] font-medium mt-2 ${
            darkMode ? "text-slate-400" : "text-slate-500"
          }`}>Scale ranges from -100 to +100</p>
        </div>

        <div className={`p-6 rounded-3xl border ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <span className={`text-xs font-bold uppercase tracking-wider ${
            darkMode ? "text-slate-400" : "text-slate-600"
          }`}>Top positive Driver</span>
          <h3 className="text-3xl font-black mt-2 text-indigo-500">{topTopic}</h3>
          <p className={`text-xs font-medium mt-3 ${
            darkMode ? "text-slate-400" : "text-slate-600"
          }`}>Theme associated with positive logs</p>
        </div>

        <div className={`p-6 rounded-3xl border ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <span className={`text-xs font-bold uppercase tracking-wider ${
            darkMode ? "text-slate-400" : "text-slate-600"
          }`}>Negative Drivers</span>
          <h3 className="text-3xl font-black mt-2 text-rose-500">{negativeDriver}</h3>
          <p className={`text-xs font-medium mt-3 ${
            darkMode ? "text-slate-400" : "text-slate-600"
          }`}>Theme associated with negative complaints</p>
        </div>
      </div>

      {/* Main split: Download Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* PDF Generator */}
        <div className={`p-6 rounded-3xl border flex flex-col justify-between space-y-4 ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <div>
            <h3 className={`font-bold text-lg mb-1 ${darkMode ? "text-slate-100" : "text-slate-900"}`}>Executive Summary PDF</h3>
            <p className={`text-xs font-medium ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Includes sentiment graphs, topic metrics, and AI recommendations overview.</p>
          </div>
          
          <div className="h-44 rounded-2xl bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 p-4">
            <svg className="w-8 h-8 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 2v-6m-9-3h9m0 0a2 2 0 012 2v3m-2-3v4m-3-4v3m-6 0a2 2 0 00-2 2v3m2-3v4" />
            </svg>
            <span className={`text-xs font-semibold ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Mock-up Preview (Sentiment Trend Chart)</span>
          </div>

          <button
            onClick={handleDownloadPDF}
            disabled={downloadingPDF}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-2xl text-sm font-bold shadow-lg shadow-blue-500/15 active:scale-[0.98] transition cursor-pointer flex justify-center items-center gap-2"
          >
            {downloadingPDF ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating PDF...
              </>
            ) : (
              "Download PDF Report"
            )}
          </button>
        </div>

        {/* CSV Data Exporter */}
        <div className={`p-6 rounded-3xl border flex flex-col justify-between space-y-4 ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <div>
            <h3 className={`font-bold text-lg mb-1 ${darkMode ? "text-slate-100" : "text-slate-900"}`}>Raw Analytics Data CSV</h3>
            <p className={`text-xs font-medium ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Contains raw review text, sentiment classification keys, dates, and response drafts.</p>
          </div>
          
          <div className="h-44 rounded-2xl bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 p-4">
            <svg className="w-8 h-8 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className={`text-xs font-semibold ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Spreadsheet Export Preview (Table Grid)</span>
          </div>

          <button
            onClick={handleExportCSV}
            disabled={exportingCSV}
            className={`w-full border py-3 rounded-2xl text-sm font-bold active:scale-[0.98] disabled:opacity-50 transition cursor-pointer flex justify-center items-center gap-2 ${
              darkMode ? "border-slate-800 hover:bg-slate-800 text-slate-200" : "border-slate-200 hover:bg-slate-50 text-slate-700"
            }`}
          >
            {exportingCSV ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
                Compiling CSV...
              </>
            ) : (
              "Export CSV Data"
            )}
          </button>
        </div>
      </div>

      {/* History log of Reports */}
      <div className={`rounded-3xl border overflow-hidden ${
        darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
      }`}>
        <div className={`p-6 border-b ${darkMode ? "border-slate-800" : "border-slate-200"}`}>
          <h3 className={`font-bold text-lg mb-1 ${darkMode ? "text-slate-100" : "text-slate-900"}`}>Generated Report Log</h3>
          <p className={`text-xs font-medium ${darkMode ? "text-slate-400" : "text-slate-600"}`}>History of report compiled during your subscription period</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-xs font-bold uppercase tracking-wider ${
                darkMode ? "border-slate-800 text-slate-400 bg-slate-900/50" : "border-slate-200 text-slate-600 bg-slate-50"
              }`}>
                <th className="px-6 py-4">Report ID</th>
                <th className="px-6 py-4">Report Name</th>
                <th className="px-6 py-4">Date Compiled</th>
                <th className="px-6 py-4">Format</th>
                <th className="px-6 py-4">Size</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-sm ${
              darkMode ? "divide-slate-800" : "divide-slate-200"
            }`}>
              {reportHistory.map((report) => (
                <tr key={report.id} className={`transition-colors ${
                  darkMode ? "hover:bg-slate-800/50" : "hover:bg-slate-50"
                }`}>
                  <td className={`px-6 py-4 font-mono text-xs ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}>{report.id}</td>
                  <td className={`px-6 py-4 font-semibold ${
                    darkMode ? "text-slate-200" : "text-slate-800"
                  }`}>{report.name}</td>
                  <td className={`px-6 py-4 text-xs ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}>{report.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                      report.format === "PDF" ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500"
                    }`}>
                      {report.format}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-xs ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}>{report.size}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setSuccessToast(`Downloading historic report ${report.id}...`);
                        setTimeout(() => setSuccessToast(""), 2000);
                      }}
                      className={`text-xs font-bold cursor-pointer ${
                        darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"
                      }`}
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Reports;
