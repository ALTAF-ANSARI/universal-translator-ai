<<<<<<< HEAD
# universal-translator-ai
language-translator-app
=======
# 🌐 LinguaFlow — Dynamic Language Translator

A full-stack web application for translating text with regional phrase support, user authentication, and translation history.

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Database | MongoDB (Mongoose) |
| Auth | JWT (JSON Web Tokens) |
| Translation | LibreTranslate API |

## ✨ Features

- 🔐 User Registration & Login with JWT
- 🌍 Translate text between 12+ languages
- 💾 Auto-save translation history per user
- 🕐 View, search & delete past translations
- 📊 All users visible in MongoDB dashboard

---

## 🚀 Getting Started Locally

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/linguaflow.git
cd linguaflow
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs on http://localhost:5173  
Backend runs on http://localhost:5000

---

## 🔧 Environment Variables (backend/.env)

```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/translatorDB
JWT_SECRET=your_secret_key_here
LIBRETRANSLATE_URL=https://libretranslate.com
```

> Get a free MongoDB Atlas cluster at: https://mongodb.com/atlas

---

## 📁 Project Structure

```
linguaflow/
├── backend/
│   ├── models/         # Mongoose schemas (User, History)
│   ├── routes/         # Express routes (auth, translate, history, users)
│   ├── middleware/     # JWT auth middleware
│   ├── server.js       # Entry point
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/      # LoginPage, RegisterPage, TranslatorPage, HistoryPage
│   │   ├── components/ # Navbar
│   │   ├── context/    # AuthContext (global user state)
│   │   └── App.jsx
│   └── index.html
└── README.md
```

---

## 🐙 Push to GitHub

```bash
# In the project root
git init
git add .
git commit -m "Initial commit: LinguaFlow full-stack app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/linguaflow.git
git push -u origin main
```

---

## ☁️ Deployment

### Backend → Render (free)
1. Go to https://render.com → New Web Service
2. Connect your GitHub repo
3. Set root directory: `backend`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add environment variables (MONGO_URI, JWT_SECRET, LIBRETRANSLATE_URL)
7. Deploy!

### Frontend → Vercel (free)
1. Go to https://vercel.com → New Project
2. Import your GitHub repo
3. Set root directory: `frontend`
4. Add env variable: `VITE_API_URL=https://your-render-app.onrender.com`
5. Update `vite.config.js` proxy target OR use env variable in axios calls
6. Deploy!

---

## 🔑 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | ❌ | Register user |
| POST | /api/auth/login | ❌ | Login user |
| GET | /api/users/me | ✅ | Get current user |
| GET | /api/users | ✅ | Get all users |
| POST | /api/translate | ✅ | Translate text |
| GET | /api/translate/languages | ❌ | Get supported languages |
| GET | /api/history | ✅ | Get user history |
| DELETE | /api/history/:id | ✅ | Delete one entry |
| DELETE | /api/history | ✅ | Clear all history |
>>>>>>> c989fff (Initial commit for AI Translator Pro with Render configuration)
