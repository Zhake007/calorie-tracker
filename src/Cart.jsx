import React from "react";
import { useCart } from "./CartContext";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-3xl mx-auto glass p-6 rounded-xl shadow-xl animate-fade">
        <h1 className="text-3xl font-bold mb-6 text-emerald-400 neon-text">🛒 Ваша корзина</h1>

        {cart.length === 0 ? (
          <p className="text-center text-gray-400">Корзина пуста 😢</p>
        ) : (
          <>
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b border-emerald-400 pb-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div>
                      <h2 className="font-semibold text-lg text-emerald-300">{item.title}</h2>
                      <p className="text-sm text-gray-300">{item.price} ₸ ×</p>
                    </div>
                  </div>

                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.id, Math.max(1, parseInt(e.target.value)))
                    }
                    className="w-16 p-1 rounded bg-white/10 border border-cyan-400 text-white text-center"
                  />

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-400 hover:text-red-500 text-xl transition"
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 text-right text-lg font-bold text-emerald-400">
              💰 Итого: {total.toFixed(2)} ₸
            </div>

            <div className="text-right mt-4">
              <Link
                to="/checkout"
                className="inline-block py-2 px-4 bg-gradient-to-r from-emerald-400 to-blue-500 text-white font-semibold rounded hover:opacity-90 transition-all"
              >
                ✅ Оформить заказ
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
