// src/AdminPanel.jsx
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "./firebase";

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ title: "", price: "", image: "" });
  const productsRef = collection(db, "products");

  const fetchProducts = async () => {
    const snapshot = await getDocs(productsRef);
    setProducts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdd = async () => {
    await addDoc(productsRef, form);
    setForm({ title: "", price: "", image: "" });
    fetchProducts();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "products", id));
    fetchProducts();
  };

  const handleUpdate = async (id, field, value) => {
    const productDoc = doc(db, "products", id);
    await updateDoc(productDoc, { [field]: value });
    fetchProducts();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🛠️ Админ-панель</h2>
      <div className="flex gap-2 mb-4">
        <input
          placeholder="Название"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border p-2"
        />
        <input
          placeholder="Цена"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border p-2"
        />
        <input
          placeholder="Ссылка на картинку"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          className="border p-2"
        />
        <button onClick={handleAdd} className="bg-emerald-500 text-white px-4 py-2">
          ➕ Добавить
        </button>
      </div>

      <ul className="space-y-2">
        {products.map((p) => (
          <li key={p.id} className="border p-4 flex justify-between items-center">
            <div>
              <input
                value={p.title}
                onChange={(e) => handleUpdate(p.id, "title", e.target.value)}
                className="border p-1 mr-2"
              />
              <input
                value={p.price}
                type="number"
                onChange={(e) => handleUpdate(p.id, "price", e.target.value)}
                className="border p-1 mr-2"
              />
            </div>
            <button
              onClick={() => handleDelete(p.id)}
              className="text-red-500 hover:underline"
            >
              🗑 Удалить
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
