import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import CalorieTracker from "./CalorieTracker";
import Profile from "./Profile";

const App = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const toggleDark = () => {
    const html = document.documentElement;
    html.classList.toggle("dark");
    const isNowDark = html.classList.contains("dark");
    setIsDark(isNowDark);
    localStorage.setItem("theme", isNowDark ? "dark" : "light");
  };

  return (
    <Router>
      <div className="flex min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-all">

        {/* Левое меню */}
        <aside className="w-48 bg-emerald-100 dark:bg-gray-800 p-4 shadow-md space-y-4">
          <h1 className="text-lg font-bold mb-6">🥗 Трекер</h1>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${
                isActive ? "bg-emerald-500 text-white" : "hover:bg-emerald-200 dark:hover:bg-gray-700"
              }`
            }
          >
            🏠 Главная
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${
                isActive ? "bg-emerald-500 text-white" : "hover:bg-emerald-200 dark:hover:bg-gray-700"
              }`
            }
          >
            👤 Профиль
          </NavLink>

          {/* Тема */}
          <button
            onClick={toggleDark}
            className="mt-8 text-sm bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded"
          >
            {isDark ? "☀️ Светлая" : "🌙 Тёмная"} тема
          </button>
        </aside>

        {/* Контент */}
        <main className="flex-1 px-6 py-8">
          <Routes>
            <Route path="/" element={<CalorieTracker />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
