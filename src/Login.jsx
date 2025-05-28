import React, { useState } from "react";
import { auth, provider } from "./firebase";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  signInWithPopup,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const { email, password } = form;

    if (!email || !password) return setError("Заполните все поля");

    try {
      await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      if (err.code === "auth/user-not-found") setError("Данный емаил не зареган");
      else if (err.code === "auth/wrong-password") setError("неверный пароль");
      else setError("Ошибка при входе: " + err.message);
    }
  };

  const handlePasswordReset = async () => {
    setError("");
    if (!resetEmail) return setError(" введите Email ");

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetSent(true);
    } catch (err) {
      setError("неверно: " + err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (err) {
      setError("Google арқылы кіру сәтсіз: " + err.message);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">🔐 Вход</h2>
      {error && <div className="text-red-500 mb-3">{error}</div>}

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="password"
          type="password"
          placeholder="пароль"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={remember}
            onChange={() => setRemember(!remember)}
          />
          Запомнить меня
        </label>

        <button className="w-full bg-emerald-600 text-white p-2 rounded hover:bg-emerald-700 transition">
          Вход
        </button>
      </form>

      <div className="mt-6">
        <p className="text-sm text-gray-500 mb-2">Забыли пароль?</p>
        <input
          type="email"
          placeholder="введите емеил"
          value={resetEmail}
          onChange={(e) => setResetEmail(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <button
          onClick={handlePasswordReset}
          className="text-blue-500 text-sm hover:underline"
        >
          восстановить пароль
        </button>
        {resetSent && (
          <p className="text-green-500 text-sm mt-2">
            Письмо отправлено, првоерьте почту
          </p>
        )}
      </div>

      <div className="mt-8 text-center">
        <p className="mb-2 text-gray-500">или через     :</p>
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-white border text-black rounded p-2 flex items-center justify-center gap-2 hover:bg-gray-100"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Вход через гугл
        </button>
      </div>
    </div>
  );
};

export default Login;
