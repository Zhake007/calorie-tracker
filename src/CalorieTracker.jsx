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
  const [meals, setMeals] = useState([]);
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [goal, setGoal] = useState("2500");
  const [category, setCategory] = useState("Завтрак");
  const [nameError, setNameError] = useState("");
  const [caloriesError, setCaloriesError] = useState("");

  // Если не авторизован
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center animate-fade">
        <h1 className="text-3xl font-bold text-emerald-400 mb-3">🥗 Трекер Калорий</h1>
        <p className="text-white mb-6">Выберите способ входа или регистрации</p>
        <div className="flex gap-4">
          <Link to="/login" className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded">Войти</Link>
          <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded">Регистрация</Link>
        </div>
      </div>
    );
  }

  // Получение цели
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

  // Получение приёмов пищи
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

  // Сохранение цели
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
      setNameError("Поле обязательно");
      return;
    }

    if (!calories.trim()) {
      setCaloriesError("Поле обязательно");
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
    <div className="p-6 max-w-2xl mx-auto animate-fade">
      <h1 className="text-3xl font-bold mb-4">🥗 Трекер Калорий</h1>

      <div className="flex items-center gap-3 mb-4">
        <img src={user.photoURL} alt="avatar" className="w-8 h-8 rounded-full" />
        <span>{user.displayName}</span>
      </div>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="mb-2 w-full p-2 border rounded"
      />

      <input
        placeholder="Что ел?"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-1 w-full p-2 border rounded"
      />
      {nameError && <p className="text-red-500 text-sm mb-2 animate-fade">{nameError}</p>}

      <input
        placeholder="Калории"
        value={calories}
        onChange={(e) => setCalories(e.target.value)}
        type="number"
        className="mb-1 w-full p-2 border rounded"
      />
      {caloriesError && <p className="text-red-500 text-sm mb-2 animate-fade">{caloriesError}</p>}

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="mb-2 w-full p-2 border rounded"
      >
        <option>Завтрак</option>
        <option>Обед</option>
        <option>Ужин</option>
        <option>Перекус</option>
      </select>

      <button
        onClick={addMeal}
        className="bg-emerald-500 text-white px-4 py-2 rounded w-full mb-4 hover:bg-emerald-600"
      >
        ➕ Добавить
      </button>

      <label className="font-semibold">🎯 Цель (ккал):</label>
      <input
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        type="number"
        className="w-full mb-2 p-2 border rounded"
      />

      <div className="w-full bg-gray-300 h-4 rounded mb-1 overflow-hidden">
        <div
          style={{ width: `${percentage}%` }}
          className="h-full bg-emerald-500 transition-all"
        ></div>
      </div>
      <p>
        Съедено: <b>{total}</b> из <b>{goal}</b> ккал
      </p>

      <h2 className="text-xl mt-6 mb-2">📋 Список приёмов пищи:</h2>
      <ul className="space-y-2 mb-6">
        {meals.map((m) => (
          <li key={m.id} className="border-l-4 border-emerald-500 pl-2 bg-emerald-50 dark:bg-gray-700 rounded">
            <b>{m.name}</b> — {m.calories} ккал ({m.category})
          </li>
        ))}
      </ul>

      {/* 🔍 Поиск еды через Open Food Facts */}
      <FoodSearch onSelect={({ name, calories }) => {
        setName(name);
        setCalories(String(calories));
      }} />
    </div>
  );
};

export default CalorieTracker;
