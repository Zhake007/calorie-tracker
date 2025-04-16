import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { auth, provider } from "./firebase";
import { signInWithPopup, signOut } from "firebase/auth";

const CalorieTracker = () => {
  const [user, setUser] = useState(null);
  const [meals, setMeals] = useState([]);
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [goal, setGoal] = useState(() => localStorage.getItem("goal") || "2500");
  const [category, setCategory] = useState("Завтрак");

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Ошибка входа:", error);
    }
  };

  const logout = () => {
    signOut(auth);
    setUser(null);
  };

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const q = query(
          collection(db, "meals"),
          where("date", "==", date),
          where("userId", "==", user?.uid || "")
        );
        
        const snapshot = await getDocs(q);
        const fetchedMeals = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMeals(fetchedMeals);
      } catch (error) {
        console.error("Ошибка при получении данных из Firebase:", error);
      }
    };

    fetchMeals();
  }, [date]);

  useEffect(() => {
    localStorage.setItem("goal", goal);
  }, [goal]);

  const addMeal = async () => {
    if (!name || !calories) return;

    const newMeal = {
      name,
      calories: parseInt(calories),
      date,
      category,
      createdAt: new Date().toISOString(),
      userId: user.uid, // ← добавили
    };
    

    try {
      await addDoc(collection(db, "meals"), newMeal);
      setMeals([...meals, newMeal]);
      setName("");
      setCalories("");
    } catch (err) {
      console.error("Ошибка при добавлении в Firebase:", err);
    }
  };

  const total = meals.filter((m) => m.date === date).reduce((sum, m) => sum + m.calories, 0);
  const percentage = Math.min((total / goal) * 100, 100);

  return (
    <div className="mt-10 bg-gradient-to-br from-emerald-100 to-white dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg transition-all duration-300 animate-fade">
      <h1 className="text-3xl font-bold mb-6 text-emerald-700 dark:text-emerald-300 text-center">
        🥗 Калькулятор Калорий
      </h1>

      {/* Авторизация */}
      {!user ? (
        <p className="text-center text-gray-600 dark:text-gray-300">
          Пожалуйста, войди через Google, чтобы отслеживать питание 🍽
        </p>
      ) : (
        <>
          {/* остальной интерфейс */}
        </>
      )}

      {!user ? (
        <button
          onClick={login}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded mb-4"
        >
          🔐 Войти через Google
        </button>
      ) : (
        <div className="flex items-center gap-3 mb-4">
          <img src={user.photoURL} alt="avatar" className="w-8 h-8 rounded-full" />
          <span className="text-gray-800 dark:text-white">{user.displayName}</span>
          <button
            onClick={logout}
            className="text-red-500 text-sm underline ml-2"
          >
            Выйти
          </button>
        </div>
      )}

      <div className="grid gap-3">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border border-emerald-300 rounded-lg px-4 py-2 text-black dark:text-white bg-white dark:bg-gray-800"
        />

        <input
          type="text"
          placeholder="Что ел?"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-black dark:text-white bg-white dark:bg-gray-800"
        />

        <input
          type="number"
          placeholder="Сколько калорий?"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-black dark:text-white bg-white dark:bg-gray-800"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-black dark:text-white bg-white dark:bg-gray-800"
        >
          <option>Завтрак</option>
          <option>Обед</option>
          <option>Ужин</option>
          <option>Перекус</option>
        </select>

        <button
          onClick={addMeal}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 rounded-lg transition"
        >
          ➕ Добавить приём пищи
        </button>
      </div>

      {/* Цель и прогресс */}
      <div className="mt-6">
        <label className="block mb-1 font-medium dark:text-gray-300">
          🎯 Цель по калориям
        </label>
        <input
          type="number"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-black dark:text-white bg-white dark:bg-gray-800 mb-3"
        />
        <div className="w-full bg-gray-300 dark:bg-gray-700 h-4 rounded-lg overflow-hidden">
          <div
            style={{ width: `${percentage}%` }}
            className={`h-full ${percentage < 100 ? "bg-emerald-500" : "bg-red-500"} transition-all`}
          ></div>
        </div>
        <p className="text-sm mt-1 dark:text-gray-300">
          Съедено: <b>{total}</b> из <b>{goal}</b> ккал
        </p>
      </div>

      {/* Список приёмов пищи */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2 text-emerald-700 dark:text-emerald-300">
          📋 Приёмы пищи:
        </h2>
        <ul className="space-y-2">
          {meals
            .filter((m) => m.date === date)
            .map((m, i) => (
              <li
                key={i}
                className="bg-white dark:bg-gray-700 text-black dark:text-white border-l-4 border-emerald-400 p-3 rounded shadow-sm"
              >
                <span className="font-medium">{m.name}</span> — {m.calories} ккал{" "}
                <span className="italic text-sm text-gray-600 dark:text-gray-400">
                  ({m.category})
                </span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default CalorieTracker;
