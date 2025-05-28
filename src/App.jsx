import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CalorieTracker from "./CalorieTracker";
import Profile from "./Profile";
import Login from "./Login";
import Register from "./Register";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import ProductCatalog from "./ProductCatalog";


function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  return (
    <Router>
      <div className="p-4 bg-emerald-100 dark:bg-gray-800 text-emerald-800 dark:text-white shadow flex gap-4">
        <Link to="/">🏠 Главная</Link>
        <Link to="/catalog">🍱 Каталог еды</Link> {/* ← ДОБАВЬ ЭТУ СТРОКУ */}
        <Link to="/profile">👤 Профиль</Link>
        {!user && <Link to="/login">🔐 Вход</Link>}
      </div>


      <Routes>
        <Route path="/catalog" element={<ProductCatalog />} />
        <Route path="/" element={<CalorieTracker user={user} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile user={user} />} />
      </Routes>
    </Router>
  );
}

export default App;
