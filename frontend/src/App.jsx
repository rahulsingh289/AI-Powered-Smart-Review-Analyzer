import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import DashboardLayout from "./components/DashboardLayout";
import AnalyzeReviews from "./pages/AnalyzeReviews";
import ReviewHistory from "./pages/ReviewHistory";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");

    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className={darkMode ? "min-h-screen bg-slate-950 text-white" : "min-h-screen bg-slate-50 text-slate-900"}>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          }
        />

        <Route
          path="/about"
          element={
            <About
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          }
        />

        <Route
          path="/login"
          element={
            <Login
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          }
        />

        {/* Dashboard nested routing */}
        <Route
          path="/dashboard"
          element={
            <DashboardLayout
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          }
        >
          <Route
            index
            element={<Dashboard darkMode={darkMode} />}
          />
          <Route
            path="analyze"
            element={<AnalyzeReviews darkMode={darkMode} />}
          />
          <Route
            path="history"
            element={<ReviewHistory darkMode={darkMode} />}
          />
          <Route
            path="reports"
            element={<Reports darkMode={darkMode} />}
          />
          <Route
            path="settings"
            element={<Settings darkMode={darkMode} />}
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;