import React, { useEffect, useState } from "react";
import { useCart } from "./CartContext.jsx";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(items);
    };
    fetchProducts();
  }, []);

  const filtered = products
    .filter((p) => p.title.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => {
      if (sort === "az") return a.title.localeCompare(b.title);
      if (sort === "za") return b.title.localeCompare(a.title);
      if (sort === "cheap") return a.price - b.price;
      if (sort === "expensive") return b.price - a.price;
      return 0;
    });

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center neon-text mb-8">🛍 Каталог продуктов</h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade">
          <input
            type="text"
            placeholder="🔍 Поиск..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input-glass w-full sm:w-2/3"
          />
          <select
            onChange={(e) => setSort(e.target.value)}
            className="input-glass w-full sm:w-1/3"
          >
            <option value="">Сортировка</option>
            <option value="az">По алфавиту ↑</option>
            <option value="za">По алфавиту ↓</option>
            <option value="cheap">Сначала дешевые</option>
            <option value="expensive">Сначала дорогие</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-fade">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="glass border border-emerald-400 rounded-xl p-5 shadow-xl hover:scale-[1.03] transition-transform duration-300"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-48 w-full object-contain mb-4 rounded"
              />
              <h2 className="text-xl font-bold text-emerald-400 neon-text mb-2">
                {item.title}
              </h2>
              <p className="text-sm text-gray-300 mb-2">
                {item.description
                  ? item.description.slice(0, 80) + "..."
                  : "Описание отсутствует"}
              </p>
              <p className="text-lg font-bold text-emerald-300 mb-3">{item.price} ₸</p>
              <button
                className="w-full py-2 rounded bg-gradient-to-r from-emerald-400 to-blue-500 text-white font-bold hover:opacity-90 transition"
                onClick={() => addToCart(item)}
              >
                🛒 В корзину
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;
