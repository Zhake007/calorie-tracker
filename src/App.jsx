import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { CartProvider } from "./CartContext.jsx";

import CalorieTracker from "./CalorieTracker";
import Profile from "./Profile";
import Login from "./Login";
import Register from "./Register";
import ProductCatalog from "./ProductCatalog";
import AdminPanel from "./AdminPanel";
import Cart from "./Cart";
import Checkout from "./Checkout";
import ConfirmPage from "./ConfirmPage.jsx";

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);

      if (u) {
        const docRef = doc(db, "users", u.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setRole(docSnap.data().role || null);
        } else {
          setRole(null);
        }
      } else {
        setRole(null);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Ошибка выхода:", error);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Загрузка...</div>;
  }

  return (
    <CartProvider>
      <Router>
        <div className="p-4 bg-emerald-100 dark:bg-gray-800 text-emerald-800 dark:text-white shadow flex gap-4">
          <Link to="/">🏠 басты бет</Link>
          {user && <Link to="/profile">👤 Профиль</Link>}
          <Link to="/catalog">🛍 продукттар</Link>
          <Link to="/cart">🧺 Корзина</Link>
          {role === "admin" && <Link to="/admin">🛠 Админ панель</Link>}
          {!user ? (
            <Link to="/login">🔐 кіру</Link>
          ) : (
            <button onClick={handleLogout} className="hover:underline">
              🚪 шығу
            </button>
          )}
        </div>

        <Routes>
          <Route path="/" element={<CalorieTracker user={user} />} />
          <Route path="/profile" element={<Profile user={user} />} />
          <Route path="/catalog" element={<ProductCatalog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirm" element={<ConfirmPage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
