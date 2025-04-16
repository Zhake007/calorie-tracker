import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";
import { auth } from "./firebase";

const Profile = () => {
  const [meals, setMeals] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      const today = new Date();
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);

      const q = query(
        collection(db, "meals"),
        where("userId", "==", user.uid)
      );

      const snapshot = await getDocs(q);
      const result = snapshot.docs
        .map((doc) => doc.data())
        .filter((meal) => {
          const mealDate = new Date(meal.date);
          return mealDate >= thirtyDaysAgo && mealDate <= today;
        });

      setMeals(result);
    };

    fetchHistory();
  }, [user]);

  const grouped = meals.reduce((acc, meal) => {
    if (!acc[meal.date]) acc[meal.date] = [];
    acc[meal.date].push(meal);
    return acc;
  }, {});

  return (
    <div className="mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-emerald-700 dark:text-emerald-300 text-center">
        👤 История питания за месяц
      </h1>

      {!user ? (
        <p className="text-center text-gray-500">Войдите, чтобы увидеть историю.</p>
      ) : (
        Object.entries(grouped)
          .sort((a, b) => b[0].localeCompare(a[0])) // по убыванию даты
          .map(([date, entries]) => (
            <div key={date} className="mb-4">
              <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-white">
                📅 {date}
              </h2>
              <ul className="space-y-1">
                {entries.map((meal, i) => (
                  <li
                    key={i}
                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-black dark:text-white"
                  >
                    <b>{meal.name}</b> — {meal.calories} ккал <i>({meal.category})</i>
                  </li>
                ))}
              </ul>
            </div>
          ))
      )}
    </div>
  );
};

export default Profile;
