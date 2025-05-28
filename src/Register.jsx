import React, { useState } from "react";
import { auth } from "./firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: ""
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [captchaValid, setCaptchaValid] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validatePassword = (pass) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/.test(pass);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { name, email, password, confirm } = form;

    if (!name || !email || !password || !confirm)
      return setError("❌ Заполните все поля");

    if (!validatePassword(password))
      return setError("❌ Пароль должен содержать минимум 8 символов, 1 заглавную, 1 строчную, 1 цифру и 1 символ (!@#$...)");

    if (password !== confirm)
      return setError("❌ Пароли не совпадают");

    if (!captchaValid)
      return setError("❌ Подтвердите, что вы не робот");

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCred.user, { displayName: name });
      navigate("/");
    } catch (err) {
      setError("❌ " + err.message);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4 text-emerald-600">📝 Регистрация</h2>
      {error && <div className="text-red-500 mb-3">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          type="text"
          placeholder="Ваше имя"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Пароль"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <span
            className="absolute top-2 right-3 cursor-pointer text-sm text-blue-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Скрыть" : "Показать"}
          </span>
        </div>
        <input
          name="confirm"
          type="password"
          placeholder="Повторите пароль"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <ReCAPTCHA
          sitekey="6LcFw00rAAAAAN7aMuEDs4CQeadglYwHkQPXwRbE"
          onChange={() => setCaptchaValid(true)}
          className="mt-2"
        />

        <button className="w-full bg-emerald-600 text-white p-2 rounded hover:bg-emerald-700 transition">
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
};

export default Register;
