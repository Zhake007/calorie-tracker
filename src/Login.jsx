import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { auth, provider } from "./firebase";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { email, password } = form;
    if (!email || !password) {
      setError("Барлық жерді толтырыңыз.");
      return;
    }

    try {
      await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setError("❌ Қате email немесе құпиясөз.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (err) {
      setError("❌ Гуглмен кіру кезінде қате пайда болды.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center text-white px-4">
      <div className="glass p-6 rounded-xl shadow-xl w-full max-w-md animate-fade">
        <h2 className="text-3xl font-bold mb-6 text-emerald-400 neon-text text-center">🔐 Кіру</h2>

        {error && <div className="text-red-400 mb-4 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="input-glass w-full"
          />

          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Құпиясөз"
              value={form.password}
              onChange={handleChange}
              className="input-glass w-full"
            />
            <span
              className="absolute top-2.5 right-3 text-sm text-cyan-400 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Жасыру" : "Көрсету"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              id="remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="accent-emerald-400"
            />
            <label htmlFor="remember">Мені жаттап ал</label>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded font-bold hover:opacity-90 transition-all"
          >
            🚀 Кіру
          </button>
        </form>

        <div className="text-center mt-4 space-y-3">
          <p className="text-sm">
            Аккаунтыңыз жоқ па?{" "}
            <Link to="/register" className="text-blue-400 underline hover:text-blue-300">
              Тіркеліңіз
            </Link>
          </p>

          <p
            onClick={handleGoogleLogin}
            className="cursor-pointer inline-block bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded transition"
          >
            🔓 Гугл арқылы кіру
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
