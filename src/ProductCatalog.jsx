import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("alphabet"); // 'alphabet' | 'calories'
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' | 'desc'

  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://world.openfoodfacts.org/cgi/search.pl", {
        params: {
          search_terms: search,
          search_simple: 1,
          action: "process",
          json: 1,
          page_size: 20,
        },
      });
      const data = res.data.products.filter(p => p.product_name && p.nutriments?.energy_100g);
      setProducts(data);
    } catch (error) {
      console.error("Ошибка при получении продуктов:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const sortProducts = (items) => {
    return [...items].sort((a, b) => {
      if (sortType === "alphabet") {
        const nameA = a.product_name.toLowerCase();
        const nameB = b.product_name.toLowerCase();
        return sortOrder === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      } else if (sortType === "calories") {
        const calA = a.nutriments.energy_100g || 0;
        const calB = b.nutriments.energy_100g || 0;
        return sortOrder === "asc" ? calA - calB : calB - calA;
      }
      return 0;
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🍱 Каталог Продуктов</h1>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Поиск по продуктам (например, хлеб)"
        className="w-full p-2 mb-4 border rounded"
      />

      <div className="flex gap-4 mb-4">
        <select value={sortType} onChange={(e) => setSortType(e.target.value)} className="p-2 border rounded">
          <option value="alphabet">По алфавиту</option>
          <option value="calories">По калориям</option>
        </select>

        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="p-2 border rounded">
          <option value="asc">↑ Возрастание</option>
          <option value="desc">↓ Убывание</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortProducts(products).map((p, i) => (
          <div key={i} className="border p-4 rounded shadow-sm bg-white dark:bg-gray-800">
            <h2 className="text-lg font-semibold mb-2">{p.product_name}</h2>
            {p.image_front_url && <img src={p.image_front_url} alt={p.product_name} className="h-32 mb-2" />}
            <p>⚡ Калорийность: <b>{p.nutriments.energy_100g || "?"}</b> ккал / 100г</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">📦 Бренд: {p.brands || "Неизвестно"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCatalog;
