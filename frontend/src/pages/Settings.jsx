import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Settings({ darkMode }) {
  const navigate = useNavigate();

  // Load values from localStorage or default
  const [name, setName] = useState(() => localStorage.getItem("settings_name") || "Rahul Singh");
  const [email, setEmail] = useState(() => localStorage.getItem("settings_email") || "rahul@reviewanalyzer.com");
  const [phone, setPhone] = useState(() => localStorage.getItem("settings_phone") || "+91 98765 43210");
  const [notifications, setNotifications] = useState(() => {
    const val = localStorage.getItem("settings_notifications");
    return val !== null ? val === "true" : true;
  });
  const [marketingEmails, setMarketingEmails] = useState(() => {
    const val = localStorage.getItem("settings_marketing");
    return val !== null ? val === "true" : false;
  });
  const [language, setLanguage] = useState(() => localStorage.getItem("settings_language") || "English");
  const [aiTone, setAiTone] = useState(() => localStorage.getItem("settings_ai_tone") || "Professional");
  
  // Fully functional base64 avatar state
  const [avatar, setAvatar] = useState(() => localStorage.getItem("settings_avatar") || "");

  // Session state (functional persistence)
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem("settings_sessions");
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, device: "Chrome on macOS", location: "Mumbai, India", active: "Current Session", current: true },
      { id: 2, device: "Safari on iPhone 15", location: "Pune, India", active: "2 hours ago", current: false },
      { id: 3, device: "Firefox on Windows 11", location: "Delhi, India", active: "3 days ago", current: false }
    ];
  });

  // Password database simulated locally in localStorage
  const [savedPassword, setSavedPassword] = useState(() => localStorage.getItem("settings_password") || "admin123");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [toastMessage, setToastMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Sync state to localStorage on changes
  useEffect(() => {
    localStorage.setItem("settings_name", name);
    localStorage.setItem("settings_email", email);
    localStorage.setItem("settings_phone", phone);
    localStorage.setItem("settings_notifications", notifications);
    localStorage.setItem("settings_marketing", marketingEmails);
    localStorage.setItem("settings_language", language);
    localStorage.setItem("settings_ai_tone", aiTone);
    localStorage.setItem("settings_sessions", JSON.stringify(sessions));
  }, [name, email, phone, notifications, marketingEmails, language, aiTone, sessions]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setToastMessage("Profile changes saved successfully!");
    // Dispatch custom event to notify DashboardLayout
    window.dispatchEvent(new Event("profileUpdated"));
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size exceeds 2MB limit!");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        localStorage.setItem("settings_avatar", reader.result);
        setToastMessage("Avatar uploaded successfully!");
        // Dispatch custom event to notify DashboardLayout
        window.dispatchEvent(new Event("profileUpdated"));
        setTimeout(() => setToastMessage(""), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (currentPassword !== savedPassword) {
      alert("Incorrect current password!");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    setSavedPassword(newPassword);
    localStorage.setItem("settings_password", newPassword);
    setToastMessage("Password updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  const handleRevokeSession = (id) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    setToastMessage("Device session revoked successfully!");
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  const handleDeleteAccount = async () => {
    setShowDeleteModal(false);
    try {
      // Reset backend database reviews
      await fetch("http://localhost:5001/api/reviews/reset", {
        method: "POST"
      });
    } catch (error) {
      console.error("Error resetting database:", error);
    }

    // Clear all settings in local storage
    localStorage.clear();
    alert("Profile deleted. Settings and review database restored to default settings.");
    
    // Redirect to landing page
    navigate("/");
  };

  return (
    <div className="max-w-5xl space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-lg font-semibold text-sm flex items-center gap-2 animate-bounce">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          {toastMessage}
        </div>
      )}

      {/* Grid: Profile settings & Security settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Profile Management Card */}
        <div className={`p-6 rounded-3xl border space-y-6 ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <div>
            <h2 className="text-lg font-bold mb-1">Personal Details</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs">
              Manage your personal information and contact options.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            {/* Avatar section */}
            <div className="flex items-center gap-4 py-2">
              <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-tr from-amber-500 to-amber-600 text-white font-black text-2xl shadow-md border-2 border-amber-500/20">
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  name.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <label className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer block text-center">
                  Upload Avatar
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
                <p className="text-[10px] text-slate-400 mt-1">JPG or PNG. Max size 2MB.</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  darkMode
                    ? "bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-400"
                    : "bg-slate-50 border-slate-200 text-slate-800 shadow-inner"
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  darkMode
                    ? "bg-slate-950 border-slate-800 text-slate-100"
                    : "bg-slate-50 border-slate-200 text-slate-800 shadow-inner"
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  darkMode
                    ? "bg-slate-950 border-slate-800 text-slate-100"
                    : "bg-slate-50 border-slate-200 text-slate-800 shadow-inner"
                }`}
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-500/15 transition cursor-pointer"
            >
              Save Profile Changes
            </button>
          </form>
        </div>

        {/* Change Password / Security Card */}
        <div className={`p-6 rounded-3xl border space-y-6 ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <div>
            <h2 className="text-lg font-bold mb-1">Security & Password</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs">
              Change your password to ensure your account security.
            </p>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  darkMode
                    ? "bg-slate-950 border-slate-800 text-slate-100"
                    : "bg-slate-50 border-slate-200 text-slate-800 shadow-inner"
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  darkMode
                    ? "bg-slate-950 border-slate-800 text-slate-100"
                    : "bg-slate-50 border-slate-200 text-slate-800 shadow-inner"
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  darkMode
                    ? "bg-slate-950 border-slate-800 text-slate-100"
                    : "bg-slate-50 border-slate-200 text-slate-800 shadow-inner"
                }`}
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-500/15 transition cursor-pointer"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>

      {/* AI Preferences & Email Toggles Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* AI Ingestion Settings Card */}
        <div className={`p-6 rounded-3xl border space-y-6 ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <div>
            <h2 className="text-lg font-bold mb-1">AI Analyzer Preferences</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs">
              Configure language and suggested response generation parameters.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Default Generation Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer ${
                  darkMode ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-200 text-slate-700 shadow-sm"
                }`}
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish (Español)</option>
                <option value="French">French (Français)</option>
                <option value="German">German (Deutsch)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">AI Response Tone</label>
              <select
                value={aiTone}
                onChange={(e) => setAiTone(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer ${
                  darkMode ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-200 text-slate-700 shadow-sm"
                }`}
              >
                <option value="Professional">Professional (Polite & Constructive)</option>
                <option value="Casual">Casual (Friendly & Warm)</option>
                <option value="Empathetic">Empathetic (Understanding & Sincere)</option>
                <option value="Concise">Concise (Direct & Quick)</option>
              </select>
              <p className="text-[10px] text-slate-400 mt-1">
                Sets the style for responses generated on bulk review text ingestions.
              </p>
            </div>
          </div>
        </div>

        {/* Email Alerts & Toggles Card */}
        <div className={`p-6 rounded-3xl border space-y-5 ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <div>
            <h2 className="text-lg font-bold mb-1">Email Preferences</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs">
              Manage report summary deliveries and updates.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">Weekly Report Summaries</h3>
                <p className="text-xs text-slate-400">Review trends & sentiment summaries.</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifications(!notifications)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none cursor-pointer ${
                  notifications ? "bg-amber-600" : "bg-slate-300 dark:bg-slate-700"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ${
                    notifications ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">Product Updates</h3>
                <p className="text-xs text-slate-400">Get alerts about new feature rollouts.</p>
              </div>
              <button
                type="button"
                onClick={() => setMarketingEmails(!marketingEmails)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none cursor-pointer ${
                  marketingEmails ? "bg-amber-600" : "bg-slate-300 dark:bg-slate-700"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ${
                    marketingEmails ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Device Session Management List */}
      <div className={`p-6 rounded-3xl border space-y-4 ${
        darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
      }`}>
        <div>
          <h2 className="text-lg font-bold mb-1">Device Session History</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            Review active locations currently logged into your Review Analyzer profile.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/20">
                <th className="px-4 py-3">Device</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Last Active</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {sessions.map((session) => (
                <tr key={session.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-950/20 transition-colors">
                  <td className="px-4 py-3.5 font-semibold text-slate-800 dark:text-slate-100">{session.device}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-500 dark:text-slate-400">{session.location}</td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      session.current ? "bg-emerald-500/10 text-emerald-500 animate-pulse" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                    }`}>
                      {session.active}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    {!session.current ? (
                      <button
                        onClick={() => handleRevokeSession(session.id)}
                        className="text-xs font-bold text-rose-600 hover:text-rose-500 cursor-pointer"
                      >
                        Revoke Access
                      </button>
                    ) : (
                      <span className="text-xs font-medium text-slate-400">Owner</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Danger Zone */}
      <div className={`p-6 rounded-3xl border space-y-4 ${
        darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
      }`}>
        <div>
          <h2 className="text-lg font-bold text-rose-500 mb-1">Danger Zone</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            Irreversible settings concerning account deletion.
          </p>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          Deleting your account will permanently remove all review imports, historic sentiment data, configurations, and AI response preferences.
        </p>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-bold py-2.5 px-6 rounded-2xl transition duration-200 text-xs cursor-pointer"
        >
          Delete Account
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md p-6 rounded-3xl border shadow-xl ${
            darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
          }`}>
            <h3 className="text-lg font-black text-rose-500">Are you absolutely sure?</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-3 leading-relaxed">
              This action cannot be undone. To permanently delete your account, click the delete button below.
            </p>
            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition cursor-pointer"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;
