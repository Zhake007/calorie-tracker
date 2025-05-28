// src/Profile.jsx
import React, { useEffect, useState } from "react";
import { db, auth } from "./firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import {
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateProfile,
} from "firebase/auth";

const Profile = ({ user }) => {
  const [history, setHistory] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.displayName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      const q = query(collection(db, "meals"), where("userId", "==", user.uid));
      const snap = await getDocs(q);
      const data = snap.docs.map((doc) => doc.data());
      setHistory(data);
    };
    fetchHistory();
  }, [user]);

  const handleUpdate = async () => {
    setError("");
    setSuccess("");

    try {
      const currentUser = auth.currentUser;

      // Обновление имени
      if (name && currentUser.displayName !== name) {
        await updateDoc(doc(db, "users", currentUser.uid), {
          name,
        });
        await updateProfile(currentUser, { displayName: name });

      }

      // Обновление email
      if (email && currentUser.email !== email) {
        await updateEmail(currentUser, email);
      }

      // Обновление пароля
      if (oldPassword && newPassword) {
        const credential = EmailAuthProvider.credential(currentUser.email, oldPassword);
        await reauthenticateWithCredential(currentUser, credential);
        await updatePassword(currentUser, newPassword);
      }

      setSuccess("✅ Данные успешно обновлены!");
    } catch (err) {
      setError("❌ " + err.message);
    }
  };

  if (!user) return <div className="p-6 text-center">Сначала войдите.</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">👤 Профиль</h1>

      {success && <p className="text-green-600 mb-2">{success}</p>}
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <div className="space-y-3 mb-6">
        <input
          type="text"
          placeholder="Имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Старый пароль"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Новый пароль"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleUpdate}
          className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
        >
          💾 Сохранить изменения
        </button>
      </div>

      <h2 className="text-xl mb-2">📜 История питания:</h2>
      <ul className="space-y-2">
        {history.map((m, i) => (
          <li
            key={i}
            className="border-l-4 border-emerald-400 pl-2 bg-emerald-50 dark:bg-gray-700 rounded"
          >
            <b>{m.date}</b>: {m.name} — {m.calories} ккал ({m.category})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Profile;
