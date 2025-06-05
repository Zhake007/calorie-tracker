import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  setDoc
} from "firebase/firestore";
import { Link } from "react-router-dom";
import FoodSearch from "./FoodSearch";

const CalorieTracker = ({ user }) => {
  // 🛑 Сначала проверка авторизации
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center animate-fade">
        <h1 className="text-3xl font-bold text-emerald-400 mb-3">🥗 Калорий Трекері</h1>
        <p className="text-black mb-6">Кіру не тіркелу әдісін танданыз</p>
        <div className="flex gap-4">
          <Link to="/login" className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded">Кіру</Link>
          <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded">Тіркелу</Link>
        </div>
      </div>
    );
  }

  // ✅ Все хуки идут после return-а
  const [meals, setMeals] = useState([]);
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [goal, setGoal] = useState("2500");
  const [category, setCategory] = useState("таңғы ас");
  const [nameError, setNameError] = useState("");
  const [caloriesError, setCaloriesError] = useState("");

  // 🎯 Цель из Firestore
  useEffect(() => {
    const fetchGoal = async () => {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setGoal(snap.data().goal || "2500");
      } else {
        await setDoc(ref, { goal: "2500" });
      }
    };
    fetchGoal();
  }, [user]);

  // 🍽 Получение еды
  const fetchMeals = async () => {
    const q = query(
      collection(db, "meals"),
      where("userId", "==", user.uid),
      where("date", "==", date)
    );
    const snap = await getDocs(q);
    setMeals(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchMeals();
  }, [user, date]);

  // 🧠 Автосохранение цели
  useEffect(() => {
    const saveGoal = async () => {
      await setDoc(doc(db, "users", user.uid), { goal }, { merge: true });
    };
    saveGoal();
  }, [goal]);

  const addMeal = async () => {
    setNameError("");
    setCaloriesError("");

    if (!name.trim()) {
      setNameError("Міндетті түрде толтырыңыз");
      return;
    }
    if (!calories.trim()) {
      setCaloriesError("Міндетті түрде толтырыңыз");
      return;
    }

    const newMeal = {
      name,
      calories: parseInt(calories),
      date,
      category,
      userId: user.uid,
      createdAt: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, "meals"), newMeal);
      await fetchMeals();
      setName("");
      setCalories("");
    } catch (error) {
      console.error("Ошибка при добавлении:", error);
    }
  };

  const total = meals.reduce((sum, m) => sum + m.calories, 0);
  const percentage = Math.min((total / parseInt(goal)) * 100, 100);

return (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 text-white">
    <div className="max-w-2xl mx-auto glassmorphic backdrop-blur-md bg-white/10 p-6 rounded-2xl shadow-2xl animate-fade transition-all">
      <h1 className="text-4xl font-extrabold mb-6 text-emerald-400 drop-shadow-[0_0_5px_#10b981]">🥗 Калорий Трекері</h1>

      <div className="flex items-center gap-3 mb-4">
        <img src={user.photoURL} alt="avatar" className="w-10 h-10 rounded-full border-2 border-emerald-400 shadow-lg" />
        <span className="font-semibold text-lg">{user.displayName}</span>
      </div>

      <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
        className="mb-3 w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition" />

      <input placeholder="не жедін?" value={name} onChange={(e) => setName(e.target.value)}
        className="mb-2 w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none" />
      {nameError && <p className="text-red-400 text-sm mb-2">{nameError}</p>}

      <input placeholder="құндылығы" value={calories} onChange={(e) => setCalories(e.target.value)} type="number"
        className="mb-2 w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none" />
      {caloriesError && <p className="text-red-400 text-sm mb-2">{caloriesError}</p>}

      <select value={category} onChange={(e) => setCategory(e.target.value)}
        className="mb-3 w-full p-3 rounded-lg bg-white/20 text-white focus:outline-none">
        <option>таңғы ас</option>
        <option>түскі ас</option>
        <option>кешкі ас</option>
        <option>Перекус</option>
      </select>

      <button onClick={addMeal}
        className="w-full mb-4 py-2 rounded-lg bg-gradient-to-r from-green-400 to-emerald-600 hover:from-emerald-500 hover:to-green-500 transition text-white font-bold shadow-lg">
        ➕ қосу
      </button>

      <label className="font-semibold text-emerald-300 block mb-1">🎯 мақсат (ккал):</label>
      <input value={goal} onChange={(e) => setGoal(e.target.value)} type="number"
        className="mb-4 w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none" />

      <div className="w-full bg-gray-700 h-5 rounded-full overflow-hidden mb-2">
        <div style={{ width: `${percentage}%` }}
          className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"></div>
      </div>
      <p className="mb-6 text-sm">Съедено: <b className="text-emerald-300">{total}</b> из <b className="text-emerald-300">{goal}</b> ккал</p>

      <h2 className="text-2xl mb-3 font-bold text-emerald-400">📋 желінген тамақтар:</h2>
      <ul className="space-y-3 mb-6">
        {meals.map((m) => (
          <li key={m.id} className="p-3 rounded-lg bg-white/10 backdrop-blur-sm border-l-4 border-emerald-400 shadow hover:scale-[1.01] transition-all">
            <b>{m.name}</b> — {m.calories} ккал ({m.category})
          </li>
        ))}
      </ul>

      <FoodSearch onSelect={({ name, calories }) => {
        setName(name);
        setCalories(String(calories));
      }} />
    </div>
  </div>
);

};

export default CalorieTracker;
