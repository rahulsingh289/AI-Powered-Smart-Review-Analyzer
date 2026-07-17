import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

function Settings({ darkMode }) {
  const navigate = useNavigate();
  const { apiFetch, logout, updateUserProfile, user } = useAuth();

  // Load values from user context fallback, then localStorage or default values
  const [name, setName] = useState(() => user?.name || localStorage.getItem("settings_name") || "Rahul Singh");
  const [email, setEmail] = useState(() => user?.email || localStorage.getItem("settings_email") || "rahul@reviewanalyzer.com");
  const [phone, setPhone] = useState(() => user?.phone || localStorage.getItem("settings_phone") || "+91 98765 43210");
  const [notifications, setNotifications] = useState(() => {
    if (user?.prefWeeklyReport !== undefined) return user.prefWeeklyReport;
    const val = localStorage.getItem("settings_notifications");
    return val !== null ? val === "true" : true;
  });
  const [marketingEmails, setMarketingEmails] = useState(() => {
    if (user?.prefMarketing !== undefined) return user.prefMarketing;
    const val = localStorage.getItem("settings_marketing");
    return val !== null ? val === "true" : false;
  });
  const [negativeAlerts, setNegativeAlerts] = useState(() => {
    if (user?.prefNegativeAlerts !== undefined) return user.prefNegativeAlerts;
    const val = localStorage.getItem("settings_negative_alerts");
    return val !== null ? val === "true" : true;
  });
  const [monthlyReport, setMonthlyReport] = useState(() => {
    if (user?.prefMonthlyReport !== undefined) return user.prefMonthlyReport;
    const val = localStorage.getItem("settings_monthly_report");
    return val !== null ? val === "true" : true;
  });
  const [securityAlerts, setSecurityAlerts] = useState(() => {
    if (user?.prefSecurityAlerts !== undefined) return user.prefSecurityAlerts;
    const val = localStorage.getItem("settings_security_alerts");
    return val !== null ? val === "true" : true;
  });
  const [language, setLanguage] = useState(() => localStorage.getItem("settings_language") || "English");
  const [aiTone, setAiTone] = useState(() => localStorage.getItem("settings_ai_tone") || "Professional");
  const [aiModel, setAiModel] = useState(() => localStorage.getItem("settings_ai_model") || "Gemini 1.5 Flash");
  const [aiTemperature, setAiTemperature] = useState(() => parseFloat(localStorage.getItem("settings_ai_temperature") || "0.4"));
  
  // Fully functional base64 avatar state
  const [avatar, setAvatar] = useState(() => localStorage.getItem("settings_avatar") || "");

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [toastMessage, setToastMessage] = useState("");
  const [supportSubmitting, setSupportSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [activeFaq, setActiveFaq] = useState(null);
  const [supportSubject, setSupportSubject] = useState("General Query");
  const [supportMessage, setSupportMessage] = useState("");
  const [supportUrgency, setSupportUrgency] = useState("Medium");
  const [attachmentName, setAttachmentName] = useState("");
  const [faqSearch, setFaqSearch] = useState("");
  const [faqCategory, setFaqCategory] = useState("All");

  const [tickets, setTickets] = useState(() => {
    const storedUser = localStorage.getItem("user");
    const userObj = storedUser ? JSON.parse(storedUser) : null;
    const key = userObj ? `settings_tickets_${userObj.id}` : "settings_tickets_guest";
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
    return [
      { id: "SR-9281", subject: "Billing / Plan", urgency: "Low", message: "Query regarding invoice availability for last month's subscription.", status: "Resolved", date: "14 Jul 2026", attachment: null }
    ];
  });

  const faqs = [
    {
      question: "How do I analyze my customer reviews?",
      answer: "Navigate to the 'Analyze Reviews' tab on the sidebar. Paste your reviews text (one per line) into the input area, select your preferred tone and language, and click 'Submit' to process them using Gemini AI.",
      category: "AI Analyzer"
    },
    {
      question: "What languages does the AI support?",
      answer: "The Gemini AI Review Analyzer supports generating responses in English, Spanish (Español), French (Français), and German (Deutsch). You can configure your default language in the settings.",
      category: "AI Analyzer"
    },
    {
      question: "How do I adjust the AI response tone?",
      answer: "In the 'AI Analyzer Preferences' card, select your desired default tone (Professional, Casual, Empathetic, or Concise) from the dropdown list. This will change the tone of all future generated answers.",
      category: "AI Analyzer"
    },
    {
      question: "Is my personal data and review content safe?",
      answer: "Yes, we prioritize security. Your data is stored securely in our PostgreSQL database. Authentication tokens are encrypted, and we do not store or sell your review inputs outside the processing scope.",
      category: "Security"
    },
    {
      question: "How does the pricing plan or usage billing work?",
      answer: "Review Analyzer uses your Gemini API Key directly, meaning billing is calculated by Google based on token consumption. We do not add extra surcharges on top of Google's standard developer API pricing.",
      category: "Billing"
    },
    {
      question: "How can I export my historical reviews reports?",
      answer: "Visit the 'Reports' page in the dashboard navigation. You can see historical distributions, filter by sentiment or theme, and use your browser print option (Cmd+P or Ctrl+P) to save reports as PDF format.",
      category: "General"
    }
  ];

  const toggleFaq = (idx) => {
    setActiveFaq(prev => prev === idx ? null : idx);
  };

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!supportMessage.trim() || supportSubmitting) return;

    setSupportSubmitting(true);

    const newTicket = {
      id: "SR-" + Math.floor(1000 + Math.random() * 9000),
      subject: supportSubject,
      urgency: supportUrgency,
      message: supportMessage,
      status: "Open",
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      attachment: attachmentName || null
    };

    setTimeout(() => {
      setTickets(prev => [newTicket, ...prev]);
      setToastMessage("Support request submitted successfully! Ticket ID " + newTicket.id + " created.");
      setSupportMessage("");
      setSupportSubject("General Query");
      setSupportUrgency("Medium");
      setAttachmentName("");

      // Clear file input value
      const fileInput = document.getElementById("support-file-input");
      if (fileInput) {
        fileInput.value = "";
      }

      setSupportSubmitting(false);

      setTimeout(() => {
        setToastMessage("");
      }, 3000);
    }, 800); // Simulate network latency
  };

  const handleCloseTicket = (id) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: "Closed" } : t));
    setToastMessage("Ticket " + id + " closed successfully.");
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  useEffect(() => {
    const key = user ? `settings_tickets_${user.id}` : "settings_tickets_guest";
    localStorage.setItem(key, JSON.stringify(tickets));
  }, [tickets, user]);

  useEffect(() => {
    const key = user ? `settings_tickets_${user.id}` : "settings_tickets_guest";
    const saved = localStorage.getItem(key);
    if (saved) {
      setTickets(JSON.parse(saved));
    } else {
      setTickets([
        { id: "SR-9281", subject: "Billing / Plan", urgency: "Low", message: "Query regarding invoice availability for last month's subscription.", status: "Resolved", date: "14 Jul 2026", attachment: null }
      ]);
    }
  }, [user]);

  // Sync settings inputs when user context changes/loads
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(faqSearch.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(faqSearch.toLowerCase());
    const matchesCategory = faqCategory === "All" || faq.category === faqCategory;
    return matchesSearch && matchesCategory;
  });

  // Sync state to localStorage on changes
  useEffect(() => {
    localStorage.setItem("settings_name", name);
    localStorage.setItem("settings_email", email);
    localStorage.setItem("settings_phone", phone);
    localStorage.setItem("settings_notifications", notifications.toString());
    localStorage.setItem("settings_marketing", marketingEmails.toString());
    localStorage.setItem("settings_negative_alerts", negativeAlerts.toString());
    localStorage.setItem("settings_monthly_report", monthlyReport.toString());
    localStorage.setItem("settings_security_alerts", securityAlerts.toString());
    localStorage.setItem("settings_language", language);
    localStorage.setItem("settings_ai_tone", aiTone);
    localStorage.setItem("settings_ai_model", aiModel);
    localStorage.setItem("settings_ai_temperature", aiTemperature.toString());
  }, [name, email, phone, notifications, marketingEmails, negativeAlerts, monthlyReport, securityAlerts, language, aiTone, aiModel, aiTemperature]);

  // Sync state preferences to backend DB on toggle changes
  useEffect(() => {
    const syncPrefs = async () => {
      try {
        const response = await apiFetch("/api/auth/preferences", {
          method: "PUT",
          body: JSON.stringify({
            prefWeeklyReport: notifications,
            prefMonthlyReport: monthlyReport,
            prefNegativeAlerts: negativeAlerts,
            prefSecurityAlerts: securityAlerts,
            prefMarketing: marketingEmails
          })
        });
        if (response.ok) {
          const data = await response.json();
          // Update client auth context state silently to keep synchronized
          updateUserProfile(data.user);
        }
      } catch (error) {
        console.error("Failed to sync preferences to backend database:", error);
      }
    };
    // Only synchronize if context user exists and is loaded
    if (user) {
      syncPrefs();
    }
  }, [notifications, monthlyReport, negativeAlerts, securityAlerts, marketingEmails]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    // Name Validation
    const nameRegex = /^[a-zA-Z\s'-]+$/;
    if (!name || name.trim().length < 2) {
      alert("Name must be at least 2 characters.");
      return;
    }
    if (!nameRegex.test(name)) {
      alert("Name can only contain letters, spaces, hyphens, or apostrophes.");
      return;
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Phone Validation
    const phoneRegex = /^\+?(\d[\s-()]*){10,}$/;
    if (phone && !phoneRegex.test(phone)) {
      alert("Please enter a valid phone number (at least 10 digits).");
      return;
    }

    try {
      const response = await apiFetch("/api/auth/profile", {
        method: "PUT",
        body: JSON.stringify({ name, email, phone }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "Failed to update profile");
        return;
      }
      updateUserProfile(data.user, data.token);
      setToastMessage("Profile changes saved successfully!");
    } catch (error) {
      console.error("Profile save error:", error);
      alert(error.message || "Failed to save profile changes");
    }
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

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    try {
      const response = await apiFetch("/api/auth/change-password", {
        method: "PUT",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "Failed to change password");
        return;
      }
      setToastMessage("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Change password error:", error);
      alert(error.message || "Failed to change password");
    }
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  const handleDeleteAccount = async () => {
    setShowDeleteModal(false);
    try {
      const response = await apiFetch("/api/auth/account", {
        method: "DELETE"
      });
      if (!response.ok) {
        const data = await response.json();
        alert(data.error || "Failed to delete account");
        return;
      }
      // Clear all settings in local storage
      localStorage.clear();
      alert("Your account has been deleted permanently.");
      logout();
    } catch (error) {
      console.error("Delete account error:", error);
      alert("An error occurred during account deletion.");
    }
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

      {/* Email Alerts & Toggles Card */}
      <div className={`p-6 rounded-3xl border space-y-5 ${
        darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
      }`}>
        <div>
          <h2 className="text-lg font-bold mb-1">Email Preferences</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            Manage report summary deliveries, critical notifications, and product updates.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Weekly Report Summaries</h3>
              <p className="text-xs text-slate-400">Review trends & weekly sentiment summary deliveries.</p>
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
              <h3 className="text-sm font-semibold">Monthly Performance Digest</h3>
              <p className="text-xs text-slate-400">Comprehensive analysis reports at the end of each month.</p>
            </div>
            <button
              type="button"
              onClick={() => setMonthlyReport(!monthlyReport)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none cursor-pointer ${
                monthlyReport ? "bg-amber-600" : "bg-slate-300 dark:bg-slate-700"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ${
                  monthlyReport ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Critical Sentiment Alerts</h3>
              <p className="text-xs text-slate-400">Notify instantly when a negative review is detected.</p>
            </div>
            <button
              type="button"
              onClick={() => setNegativeAlerts(!negativeAlerts)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none cursor-pointer ${
                negativeAlerts ? "bg-amber-600" : "bg-slate-300 dark:bg-slate-700"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ${
                  negativeAlerts ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Security Alerts</h3>
              <p className="text-xs text-slate-400">Notify instantly on new log-ins or credential modifications.</p>
            </div>
            <button
              type="button"
              onClick={() => setSecurityAlerts(!securityAlerts)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none cursor-pointer ${
                securityAlerts ? "bg-amber-600" : "bg-slate-300 dark:bg-slate-700"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ${
                  securityAlerts ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Product Updates</h3>
              <p className="text-xs text-slate-400">Get alerts about new feature rollouts and tips.</p>
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



      {/* Help & Support Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* FAQs */}
        <div className={`p-6 rounded-3xl border space-y-4 lg:col-span-7 ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <div>
            <h2 className="text-lg font-bold mb-1">Frequently Asked Questions</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs">
              Quick answers to common questions about the AI Review Analyzer.
            </p>
          </div>

          {/* FAQ Search and Filter Category Badges */}
          <div className="space-y-3">
            <input
              type="text"
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              placeholder="Search FAQs..."
              className={`w-full px-4 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                darkMode ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-200 text-slate-700"
              }`}
            />
            
            <div className="flex flex-wrap gap-1.5 py-1">
              {["All", "General", "AI Analyzer", "Security", "Billing"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFaqCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                    faqCategory === cat
                      ? "bg-amber-600 text-white"
                      : darkMode
                      ? "bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200"
                      : "bg-slate-100 border border-slate-200 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {filteredFaqs.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4">No matching questions found.</p>
            ) : (
              filteredFaqs.map((faq, idx) => (
                <div key={idx} className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex justify-between items-center text-left py-2 font-semibold text-sm hover:text-amber-600 transition duration-150 focus:outline-none"
                  >
                    <span className="pr-4">{faq.question}</span>
                    <svg
                      className={`w-4 h-4 flex-shrink-0 transform transition-transform duration-200 ${
                        activeFaq === idx ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      activeFaq === idx ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Contact Support Form */}
        <div className={`p-6 rounded-3xl border space-y-6 lg:col-span-5 ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <div>
            <h2 className="text-lg font-bold mb-1">Contact Support</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs">
              Submit a support ticket or request help from our technical team.
            </p>
          </div>

          <form onSubmit={handleSupportSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Subject</label>
                <select
                  value={supportSubject}
                  onChange={(e) => setSupportSubject(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer ${
                    darkMode ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-200 text-slate-700 shadow-sm"
                  }`}
                >
                  <option value="General Query">General Query</option>
                  <option value="API Issues">API Issues</option>
                  <option value="Billing / Plan">Billing</option>
                  <option value="Bug Report">Report a Bug</option>
                  <option value="Feature Request">Feature Request</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Urgency</label>
                <select
                  value={supportUrgency}
                  onChange={(e) => setSupportUrgency(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer ${
                    darkMode ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-200 text-slate-700 shadow-sm"
                  }`}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Message Details</label>
                <span className="text-[9px] font-semibold text-slate-400">{supportMessage.length} / 1000</span>
              </div>
              <textarea
                required
                maxLength="1000"
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
                placeholder="Explain the problem in detail..."
                rows="3"
                className={`w-full px-4 py-2 rounded-xl border text-xs transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none ${
                  darkMode
                    ? "bg-slate-950 border-slate-800 text-slate-100"
                    : "bg-slate-50 border-slate-200 text-slate-800 shadow-inner"
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Attachments (Optional)</label>
              <div 
                className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                  attachmentName 
                    ? "border-emerald-500/50 bg-emerald-500/5 dark:bg-emerald-500/10" 
                    : darkMode 
                      ? "border-slate-800 hover:border-slate-700 bg-slate-950/40" 
                      : "border-slate-200 hover:border-slate-300 bg-slate-50/50 shadow-inner"
                }`}
                onClick={() => document.getElementById("support-file-input").click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const file = e.dataTransfer.files[0];
                  if (file) {
                    if (file.size === 0) {
                      alert("Selected file is empty! Please choose a file with size greater than 0.");
                      return;
                    }
                    if (file.size > 2 * 1024 * 1024) {
                      alert("Selected file is too large! Maximum attachment size is 2MB.");
                      return;
                    }
                    setAttachmentName(file.name);
                  }
                }}
              >
                <input
                  type="file"
                  id="support-file-input"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      if (file.size === 0) {
                        alert("Selected file is empty! Please choose a file with size greater than 0.");
                        e.target.value = "";
                        setAttachmentName("");
                        return;
                      }
                      if (file.size > 2 * 1024 * 1024) {
                        alert("Selected file is too large! Maximum attachment size is 2MB.");
                        e.target.value = "";
                        setAttachmentName("");
                        return;
                      }
                      setAttachmentName(file.name);
                    }
                  }}
                  className="hidden"
                />
                
                <div className="flex flex-col items-center justify-center space-y-1">
                  <svg className={`w-6 h-6 ${attachmentName ? "text-emerald-500 animate-pulse" : "text-slate-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {attachmentName ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    )}
                  </svg>
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate max-w-[200px]" title={attachmentName}>
                    {attachmentName ? `Attached: ${attachmentName}` : "Click or drag file to attach"}
                  </p>
                  <p className="text-[8px] text-slate-400">Maximum file size: 2MB</p>
                </div>
              </div>
              {attachmentName && (
                <div className="flex justify-end mt-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAttachmentName("");
                      const fileInput = document.getElementById("support-file-input");
                      if (fileInput) fileInput.value = "";
                    }}
                    className="text-[10px] text-rose-500 hover:text-rose-400 font-bold focus:outline-none cursor-pointer"
                  >
                    Remove File
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={supportSubmitting}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold text-white shadow-md transition flex items-center gap-2 cursor-pointer ${
                supportSubmitting 
                  ? "bg-slate-400 dark:bg-slate-700 cursor-not-allowed shadow-none" 
                  : "bg-amber-600 hover:bg-amber-700 shadow-amber-500/15"
              }`}
            >
              {supportSubmitting ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </>
              ) : (
                "Submit Ticket"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Support Tickets History Section */}
      <div className={`p-6 rounded-3xl border space-y-4 ${
        darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
      }`}>
        <div>
          <h2 className="text-lg font-bold mb-1">Support Ticket History</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            Track status and resolution details of your submitted help requests.
          </p>
        </div>

        {tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-2 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
            <svg className="w-10 h-10 text-slate-300 dark:text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">No support tickets found</p>
            <p className="text-[10px] text-slate-400 max-w-xs">Need technical or billing help? Fill out the contact form above to submit a new inquiry.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/20">
                  <th className="px-4 py-3">Ticket ID</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Urgency</th>
                  <th className="px-4 py-3">Message</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {tickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-950/20 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-xs font-bold text-amber-600">{t.id}</td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800 dark:text-slate-100">{t.subject}</td>
                    <td className="px-4 py-3.5 text-xs">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.urgency === "Urgent" ? "bg-rose-500/10 text-rose-500" :
                        t.urgency === "High" ? "bg-orange-500/10 text-orange-500" :
                        t.urgency === "Medium" ? "bg-amber-500/10 text-amber-500" :
                        "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                      }`}>
                        {t.urgency}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]" title={t.message}>
                      <div>
                        {t.message}
                        {t.attachment && (
                          <div className="text-[10px] text-amber-600 font-semibold mt-1 flex items-center gap-1">
                            <svg className="w-3.5 h-3.5 inline text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                            {t.attachment}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.status === "Open" ? "bg-sky-500/10 text-sky-500" :
                        t.status === "Closed" ? "bg-slate-100 dark:bg-slate-800 text-slate-400" :
                        "bg-emerald-500/10 text-emerald-500"
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-500 dark:text-slate-400">{t.date}</td>
                    <td className="px-4 py-3.5 text-right">
                      {t.status === "Open" ? (
                        <button
                          type="button"
                          onClick={() => handleCloseTicket(t.id)}
                          className="text-xs font-bold text-rose-600 hover:text-rose-500 cursor-pointer focus:outline-none"
                        >
                          Close Ticket
                        </button>
                      ) : (
                        <span className="text-xs font-medium text-slate-400">Locked</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
