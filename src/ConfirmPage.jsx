import React from "react";

const ConfirmPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 text-white">
      <div className="glass p-6 rounded-xl shadow-xl max-w-xl w-full text-center animate-fade">
        <h1 className="text-3xl font-bold text-emerald-400 neon-text mb-4">
          🎉 Тапсырыс сәтті жіберілді!
        </h1>
        <p className="text-lg text-gray-300">
          Біз сізбен жақын арада хабарласамыз. Рақмет!
        </p>
      </div>
    </div>
  );
};

export default ConfirmPage;
