import React, { useState } from "react";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("Наличные");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validatePhone = (number) => /^(\+?\d{10,15})$/.test(number);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone || !address) {
      setError("❌ Барлық жолды толтырыңыз");
      return;
    }
    if (!validatePhone(phone)) {
      setError("❌ Телефон дұрыс форматта емес");
      return;
    }

    clearCart();
    navigate("/confirm");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 text-white">
      <div className="glass p-6 rounded-xl shadow-xl w-full max-w-2xl animate-fade">
        <h1 className="text-3xl font-bold text-emerald-400 neon-text mb-6 text-center">📦 Тапсырысты рәсімдеу</h1>

        {error && <p className="text-red-400 mb-4 text-sm text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Аты-жөні"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-glass w-full"
          />
          <input
            placeholder="Телефон"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input-glass w-full"
          />
          <input
            placeholder="Жеткізу мекенжайы"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="input-glass w-full"
          />
          <select
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
            className="input-glass w-full"
          >
            <option>Наличные</option>
            <option>Картой при получении</option>
          </select>

          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded font-bold hover:opacity-90 transition-all"
          >
            ✅ Растау
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
