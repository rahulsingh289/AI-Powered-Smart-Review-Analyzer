import { useState, useEffect } from "react";
import Loader from "../components/ui/Loader";

function ReviewHistory({ darkMode }) {
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSentiment, setFilterSentiment] = useState("All");
  const [filterTheme, setFilterTheme] = useState("All");
  const [isEditingResponse, setIsEditingResponse] = useState(false);
  const [editedResponseText, setEditedResponseText] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch reviews from the backend REST API
  const fetchReviews = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.append("q", searchQuery);
      if (filterSentiment !== "All") queryParams.append("sentiment", filterSentiment);
      if (filterTheme !== "All") queryParams.append("theme", filterTheme);

      const response = await fetch(`http://localhost:5001/api/reviews?${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
        
        // Keep selectedReview pointer updated or default to first index
        if (data.length > 0) {
          // If previous selection still exists in the new list, keep it selected
          const stillExists = selectedReview ? data.find(r => r.id === selectedReview.id) : null;
          setSelectedReview(stillExists || data[0]);
        } else {
          setSelectedReview(null);
        }
      }
    } catch (error) {
      console.error("Error fetching reviews list:", error);
    }
  };

  // Run fetches on mount or filter changes
  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true);
      await fetchReviews();
      setCurrentPage(1); // Reset to page 1 when query filters change
      setLoading(false);
    };
    loadReviews();
  }, [searchQuery, filterSentiment, filterTheme]);

  // Pagination calculations
  const pageSize = 4;
  const totalPages = Math.ceil(reviews.length / pageSize) || 1;
  const paginatedReviews = reviews.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Clamp current page if total pages decreases below currentPage (e.g. after deletions)
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // Auto-select the first review of the current page when switching pages or if data changes
  useEffect(() => {
    if (paginatedReviews.length > 0) {
      const isSelectedOnCurrentPage = paginatedReviews.some(r => r.id === selectedReview?.id);
      if (!isSelectedOnCurrentPage) {
        setSelectedReview(paginatedReviews[0]);
      }
    } else {
      setSelectedReview(null);
    }
  }, [currentPage, reviews]);

  // Sync edit field when selection changes
  useEffect(() => {
    setIsEditingResponse(false);
    setEditedResponseText(selectedReview ? selectedReview.suggestedResponse : "");
  }, [selectedReview]);

  // Delete review via REST DELETE endpoint
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/api/reviews/${id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        // Refresh list
        fetchReviews();
      } else {
        alert("Failed to delete review on server.");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  // Save modified suggested response via REST PUT endpoint
  const handleSaveResponse = async () => {
    if (!selectedReview) return;
    try {
      const response = await fetch(`http://localhost:5001/api/reviews/${selectedReview.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          suggestedResponse: editedResponseText
        })
      });

      if (response.ok) {
        const updated = await response.json();
        setSelectedReview(updated);
        
        // Update local review object in arrays without full list reload
        setReviews(prev => prev.map(r => r.id === updated.id ? updated : r));
        setIsEditingResponse(false);
      } else {
        alert("Failed to update response on server.");
      }
    } catch (error) {
      console.error("Error updating response:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header controls & Filters (UX Improvements) */}
      <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between">
        <h2 className={`text-xl font-bold ${darkMode ? "text-slate-100" : "text-slate-900"}`}>Review History</h2>
        
        {/* Controls block */}
        <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reviews..."
              className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode
                  ? "bg-slate-900 border-slate-800 text-slate-100 placeholder-slate-500"
                  : "bg-white border-slate-200 text-slate-800 placeholder-slate-400 shadow-sm"
              }`}
            />
            <svg
              className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Sentiment Filter */}
          <select
            value={filterSentiment}
            onChange={(e) => setFilterSentiment(e.target.value)}
            className={`px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
              darkMode ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-700 shadow-sm"
            }`}
          >
            <option value="All">All Sentiments</option>
            <option value="Positive">Positive</option>
            <option value="Neutral">Neutral</option>
            <option value="Negative">Negative</option>
          </select>

          {/* Theme Filter */}
          <select
            value={filterTheme}
            onChange={(e) => setFilterTheme(e.target.value)}
            className={`px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
              darkMode ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-700 shadow-sm"
            }`}
          >
            <option value="All">All Themes</option>
            <option value="Food">Food/Host</option>
            <option value="Cleanliness">Cleanliness</option>
            <option value="Facilities">Facilities</option>
            <option value="Location">Location</option>
            <option value="Value">Value</option>
          </select>
        </div>
      </div>

      {/* Grid split for Table vs Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Table column */}
        <div className={`lg:col-span-2 rounded-3xl border overflow-hidden ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        }`}>
          {loading ? (
            <div className="py-20 text-center">
              <Loader />
              <p className={`text-xs font-medium mt-2 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Loading reviews...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b text-xs font-bold uppercase tracking-wider ${
                    darkMode ? "border-slate-800 text-slate-400 bg-slate-900/50" : "border-slate-200 text-slate-600 bg-slate-50"
                  }`}>
                    <th className="px-6 py-4">Review</th>
                    <th className="px-6 py-4">Sentiment</th>
                    <th className="px-6 py-4">Theme</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className={`divide-y text-sm ${
                  darkMode ? "divide-slate-800" : "divide-slate-200"
                }`}>
                  {paginatedReviews.length > 0 ? (
                    paginatedReviews.map((review) => (
                      <tr
                        key={review.id}
                        onClick={() => setSelectedReview(review)}
                        className={`cursor-pointer transition-colors ${
                          selectedReview?.id === review.id
                            ? darkMode
                              ? "bg-blue-600/10 text-blue-400"
                              : "bg-blue-50 text-blue-700"
                            : darkMode
                            ? "hover:bg-slate-800/50"
                            : "hover:bg-slate-50"
                        }`}
                      >
                        <td className={`px-6 py-4 max-w-[200px] truncate font-medium ${
                          darkMode ? "text-slate-200" : "text-slate-800"
                        }`}>
                          {review.text}
                        </td>
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
                        <td className={`px-6 py-4 text-xs whitespace-nowrap font-medium ${
                          darkMode ? "text-slate-400" : "text-slate-500"
                        }`}>{review.date}</td>
                        <td className="px-6 py-4 flex gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedReview(review);
                            }}
                            className={`text-xs font-bold cursor-pointer ${
                              darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"
                            }`}
                          >
                            View
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(review.id);
                            }}
                            className={`text-xs font-bold cursor-pointer ${
                              darkMode ? "text-rose-400 hover:text-rose-300" : "text-rose-600 hover:text-rose-700"
                            }`}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className={`px-6 py-8 text-center text-sm font-medium ${
                        darkMode ? "text-slate-400" : "text-slate-500"
                      }`}>
                        No reviews found matching the filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer */}
          <div className="p-4 border-t flex justify-center items-center gap-1 ${
            darkMode ? 'border-slate-800' : 'border-slate-200'
          }">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ${
                darkMode ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-600"
              }`}
            >
              &lt;
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition cursor-pointer ${
                  currentPage === pageNum
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
                    : darkMode
                    ? "hover:bg-slate-800 text-slate-400"
                    : "hover:bg-slate-100 text-slate-700"
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ${
                darkMode ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-600"
              }`}
            >
              &gt;
            </button>
          </div>
        </div>

        {/* Review Details Side Panel */}
        <div className={`p-6 rounded-3xl border space-y-5 ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <div>
            <h3 className={`font-bold text-lg mb-1 ${darkMode ? "text-slate-100" : "text-slate-900"}`}>Review Details</h3>
            <p className={`text-xs font-medium ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Deep-dive and suggested action</p>
          </div>

          {selectedReview ? (
            <div className="space-y-4">
              {/* Review Text */}
              <div className="space-y-1.5">
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  darkMode ? "text-slate-400" : "text-slate-600"
                }`}>Review</span>
                <p className={`p-4 rounded-2xl text-sm leading-relaxed border ${
                  darkMode ? "bg-slate-950/40 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-800"
                }`}>
                  {selectedReview.text}
                </p>
              </div>

              {/* Sentiment badge */}
              <div className="space-y-1.5">
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  darkMode ? "text-slate-400" : "text-slate-600"
                }`}>Sentiment</span>
                <div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                    selectedReview.sentiment === "Positive"
                      ? darkMode
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-emerald-100 text-emerald-700"
                      : selectedReview.sentiment === "Neutral"
                      ? darkMode
                        ? "bg-indigo-500/15 text-indigo-400"
                        : "bg-indigo-100 text-indigo-700"
                      : darkMode
                        ? "bg-rose-500/15 text-rose-400"
                        : "bg-rose-100 text-rose-700"
                  }`}>
                    {selectedReview.sentiment}
                  </span>
                </div>
              </div>

              {/* Theme badge */}
              <div className="space-y-1.5">
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  darkMode ? "text-slate-400" : "text-slate-600"
                }`}>Theme</span>
                <div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    darkMode ? "bg-slate-800 text-slate-300" : "bg-slate-200 text-slate-700"
                  }`}>
                    {selectedReview.theme}
                  </span>
                </div>
              </div>

              {/* Suggested response (Editable) */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    darkMode ? "text-slate-400" : "text-slate-600"
                  }`}>Suggested Response</span>
                  {!isEditingResponse ? (
                    <button
                      onClick={() => setIsEditingResponse(true)}
                      className={`text-xs font-bold cursor-pointer ${
                        darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"
                      }`}
                    >
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveResponse}
                        className={`text-xs font-bold cursor-pointer ${
                          darkMode ? "text-emerald-400 hover:text-emerald-300" : "text-emerald-600 hover:text-emerald-700"
                        }`}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingResponse(false);
                          setEditedResponseText(selectedReview.suggestedResponse);
                        }}
                        className={`text-xs font-bold cursor-pointer ${
                          darkMode ? "text-slate-400 hover:text-slate-300" : "text-slate-600 hover:text-slate-700"
                        }`}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
                
                {isEditingResponse ? (
                  <textarea
                    value={editedResponseText}
                    onChange={(e) => setEditedResponseText(e.target.value)}
                    rows="4"
                    className={`w-full p-3 rounded-2xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode
                        ? "bg-slate-950 border-slate-800 text-slate-100"
                        : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  />
                ) : (
                  <p className={`p-4 rounded-2xl text-sm leading-relaxed border border-dashed ${
                    darkMode ? "bg-slate-950/20 border-slate-800 text-slate-300" : "bg-blue-50/40 border-blue-200 text-slate-700"
                  }`}>
                    {selectedReview.suggestedResponse}
                  </p>
                )}
              </div>

              {/* Sidebar Action Button */}
              <button
                onClick={() => handleDelete(selectedReview.id)}
                className="w-full mt-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-bold py-2.5 rounded-2xl transition duration-200 text-xs cursor-pointer"
              >
                Delete Review from Log
              </button>
            </div>
          ) : (
            <div className={`py-12 text-center text-sm font-medium ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}>
              Select a review from the list to view detailed metrics and auto-responses.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReviewHistory;
