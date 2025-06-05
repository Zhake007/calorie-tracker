import React, { useState } from "react";
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
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
      return setError("❌ Барлық жолды толтыр");

    if (!validatePassword(password))
      return setError("❌ Құпиясөз кем дегенде 8 символ, 1 бас әріп, 1 цифра, 1 символ болуы керек");

    if (password !== confirm)
      return setError("❌ Құпиясөздер сәйкес келмейді");

    if (!captchaValid)
      return setError("❌ Робот емес екеніңді раста");

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCred.user, { displayName: name });

      await setDoc(doc(db, "users", userCred.user.uid), {
        name,
        email,
        role: "user"
      });

      navigate("/");
    } catch (err) {
      setError("❌ " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center text-white px-4">
      <div className="glass p-6 rounded-xl shadow-xl w-full max-w-md animate-fade">
        <h2 className="text-3xl font-bold mb-6 text-emerald-400 neon-text text-center">📝 Тіркелу</h2>

        {error && <div className="text-red-400 mb-4 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Лақап атыңыз"
            onChange={handleChange}
            className="input-glass w-full"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="input-glass w-full"
          />

          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Құпиясөз"
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

          <input
            name="confirm"
            type="password"
            placeholder="Құпиясөзді қайталаңыз"
            onChange={handleChange}
            className="input-glass w-full"
          />

          <div className="flex justify-center">
            <ReCAPTCHA
              sitekey="6LcFw00rAAAAAN7aMuEDs4CQeadglYwHkQPXwRbE"
              onChange={() => setCaptchaValid(true)}
              className="mt-2"
            />
          </div>

          <button className="w-full py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded font-bold hover:opacity-90 transition-all">
            ✅ Тіркелу
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
