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

      if (name && currentUser.displayName !== name) {
        await updateDoc(doc(db, "users", currentUser.uid), { name });
        await updateProfile(currentUser, { displayName: name });
      }

      if (email && currentUser.email !== email) {
        await updateEmail(currentUser, email);
      }

      if (oldPassword && newPassword) {
        const credential = EmailAuthProvider.credential(currentUser.email, oldPassword);
        await reauthenticateWithCredential(currentUser, credential);
        await updatePassword(currentUser, newPassword);
      }

      setSuccess("✅ Мәліметтер сәтті өзгертілді!");
    } catch (err) {
      setError("❌ " + err.message);
    }
  };

  if (!user) return <div className="p-6 text-center">Бірінші кіріңіз.</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="glass p-6 rounded-xl shadow-xl w-full max-w-2xl animate-fade">
        <h1 className="text-3xl font-bold mb-6 text-emerald-400 neon-text">👤 Жеке кабинет</h1>

        {success && <p className="text-green-400 mb-2">{success}</p>}
        {error && <p className="text-red-400 mb-2">{error}</p>}

        <div className="space-y-3 mb-6">
          <input
            type="text"
            placeholder="Атыңыз"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-glass"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-glass"
          />
          <input
            type="password"
            placeholder="ескі құпиясөз"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="input-glass"
          />
          <input
            type="password"
            placeholder="Жаңа құпиясөз"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="input-glass"
          />
          <button
            onClick={handleUpdate}
            className="w-full py-2 px-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300"
          >
            💾 Өзгерістерді сақтау
          </button>
        </div>

        <h2 className="text-2xl mb-4 text-emerald-300">📜 желінген тамақтар тарихы:</h2>
        <ul className="space-y-2 max-h-64 overflow-y-auto">
          {history.map((m, i) => (
            <li key={i} className="bg-emerald-900/30 backdrop-blur-md rounded px-3 py-2 border-l-4 border-emerald-400 text-white">
              <b>{m.date}</b>: {m.name} — {m.calories} ккал ({m.category})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Profile;
