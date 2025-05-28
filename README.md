<h1 align="center">🥗 Calorie Tracker</h1>
<p align="center">
  Современное PWA-приложение для учёта калорий с авторизацией через Google и Firebase.
</p>

---

## 📌 Описание

**Calorie Tracker** — это трекер питания и калорий, который позволяет добавлять приёмы пищи, отслеживать дневную норму, вести историю и просматривать прогресс.

Проект поддерживает Google авторизацию, тёмную/светлую тему, локализацию, Firebase Firestore и может быть установлен как полноценное PWA-приложение на Android/iOS/ПК.

---

## ⚙️ Технологии

| Направление     | Стек                         |
|----------------|------------------------------|
| Frontend       | React + Vite + TailwindCSS   |
| Backend        | Firebase (Auth, Firestore)   |
| PWA            | Manifest + Service Worker    |
| Анимации       | Tailwind transition + fade   |
| Стилизация     | Полная адаптация под светлую/тёмную тему |

---

## 🧠 Основные фичи

✅ Авторизация через Google  
✅ Добавление еды с калориями, категориями и датой  
✅ Цель по калориям и прогресс-бар  
✅ История питания за месяц  
✅ Адаптивный дизайн (для телефона и ПК)  
✅ Тёмная/Светлая тема  
✅ PWA: можно установить как приложение  
✅ Firebase Firestore для хранения данных  
✅ Поддержка локализации (в планах 🇷🇺 / 🇰🇿 / 🇬🇧)

---

## 📸 Скриншоты


![image](https://github.com/user-attachments/assets/617d4884-946d-4dcb-ae06-93b45550d9c4)


## 🚀 Установка и запуск

```bash
git clone https://github.com/Zhake007/calorie-tracker.git
cd calorie-tracker
npm install
npm run dev
```

🔐 Настройка Firebase
Создай файл src/firebase.js и вставь туда:

```
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "PROJECT.firebaseapp.com",
  projectId: "PROJECT_ID",
  storageBucket: "PROJECT.appspot.com",
  messagingSenderId: "ID",
  appId: "APP_ID",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
```


🧩 Возможные доработки

🔍 Поиск по продуктам

📊 Статистика и графики

🔁 Повтор еды (любимые блюда)

📅 Календарь в виде сетки

📲 Push-уведомления

💾 Импорт/экспорт данных

👨‍💻 Автор

Telegram: @zhakenti07

GitHub: Zhake007

Проект сделан с ❤️ и идеей сделать жизнь здоровее

⭐ Не забудь поставить ⭐ звезду на репозиторий, если трекер тебе понравился!
