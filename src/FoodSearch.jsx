import React, { useState } from "react";

const FoodSearch = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const searchFood = async () => {
    if (!query.trim()) return;
    const res = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&search_simple=1&action=process&json=1&page_size=10`
    );
    const data = await res.json();
    setResults(data.products || []);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">🔍 Поиск продуктов</h2>
      <div className="flex gap-2 mb-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Начните вводить, например: Хлеб..."
        />
        <button
          onClick={searchFood}
          className="bg-emerald-500 text-white px-4 rounded hover:bg-emerald-600"
        >
          Поиск
        </button>
      </div>

      <div className="grid gap-4">
        {results.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-emerald-50"
            onClick={() => {
              const cal = item.nutriments?.["energy-kcal_100g"];
              if (onSelect && item.product_name && cal) {
                onSelect({
                  name: item.product_name,
                  calories: Math.round(cal),
                });
              }
            }}
          >
            <img
              src={item.image_thumb_url || item.image_front_thumb_url || ""}
              alt={item.product_name}
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <p className="font-medium">{item.product_name}</p>
              <p className="text-sm text-gray-600">
                {item.nutriments?.["energy-kcal_100g"] || "?"} ккал / 100г
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodSearch;
