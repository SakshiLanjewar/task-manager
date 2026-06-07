# 🚀 TaskFlow — MERN Kanban Dashboard

> **Live Demo:** [https://task-manager-ten-delta-56.vercel.app](https://task-manager-ten-delta-56.vercel.app)

A full-stack Kanban-style Task Management App built with the **MERN stack** — MongoDB, Express, React, and Node.js. Built to practice full-stack development, focusing on clean code structure, REST API design, and a smooth drag-and-drop UI experience.

---

## 🌐 Live Links

| Service | URL |
|---------|-----|
| 🖥️ Frontend (Vercel) | [https://task-manager-ten-delta-56.vercel.app](https://task-manager-ten-delta-56.vercel.app) |
| ⚙️ Backend API (Railway) | [https://task-manager-production-51a6.up.railway.app/api/health](https://task-manager-production-51a6.up.railway.app/api/health) |

---

## ✨ Features

| Feature | Details |
|---------|---------|
| 📋 Kanban Board | Three columns: To Do, In Progress, Done |
| 🖱️ Drag & Drop | Move tasks between columns, order updates automatically |
| ✅ Full CRUD | Add, edit, and delete tasks |
| 🎨 Priority Badges | High 🔴 / Medium 🟡 / Low 🟢 with color-coded cards |
| 📅 Due Dates | Shows overdue and "due today" warnings |
| 🔍 Priority Filter | Filter all columns by priority level |
| 📊 Progress Bar | Live completion percentage in the header |
| 📱 Responsive Design | Works on mobile and desktop |

---

## ☁️ Deployment Guide

### 🖥️ Frontend — Deploy on Vercel

1. Push your code to **GitHub**
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your GitHub repo
3. Set **Root Directory** to `client`
4. Add Environment Variable:
   ```
   REACT_APP_API_URL = https://your-backend.up.railway.app/api
   ```
5. Click **Deploy** ✅

---

### ⚙️ Backend — Deploy on Railway

1. Go to [railway.app](https://railway.app) → **New Project** → Deploy from GitHub
2. Select your repo → Set **Root Directory** to `server`
3. Add these Environment Variables in Railway:
   ```
   MONGO_URI = your_mongodb_connection_string
   CLIENT_URL = https://your-frontend.vercel.app
   PORT = 5000
   ```
4. Railway will auto-deploy on every `git push` ✅

---

### 🗄️ Database — MongoDB on Railway

1. In Railway → **New Service** → **MongoDB**
2. Copy the `MONGO_URI` from Variables tab
3. Paste it in your backend service Variables ✅

---

## 🏗 Project Structure

```
task-dashboard/
├── server/
│   ├── models/Task.js
│   ├── routes/tasks.js
│   ├── middleware/validation.js
│   └── index.js
└── client/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Board.js
    │   │   ├── KanbanColumn.js
    │   │   ├── TaskCard.js
    │   │   ├── TaskForm.js
    │   │   └── Login.js
    │   ├── styles/
    │   │   ├── App.css
    │   │   └── Login.css
    │   ├── context/TaskContext.js
    │   ├── utils/
    │   │   ├── api.js
    │   │   └── constants.js
    │   ├── App.js
    │   └── index.js
    └── package.json
```

---

## 🚀 Getting Started (Local Setup)

### Requirements
- Node.js v18 or higher
- MongoDB running locally on port 27017

### Installation

```bash
# Step 1 — Install all dependencies
npm run install:all

# Step 2 — Setup environment file
cp server/.env.example server/.env

# Step 3 — Start the app
npm run dev
```

- Backend: http://localhost:5000
- Frontend: http://localhost:3000

---

## 📦 Task Object Shape

```json
{
  "_id": "64abc...",
  "title": "Build the login page",
  "description": "Use React + Tailwind",
  "priority": "high",
  "status": "inprogress",
  "dueDate": "2024-12-31T00:00:00.000Z",
  "order": 0,
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

## 🛠 Tech Stack

### Backend
- Node.js + Express 4
- MongoDB + Mongoose 7
- express-validator (input validation)
- dotenv, cors

### Frontend
- React 18 (functional components + hooks)
- React Context + useReducer (state management)
- @hello-pangea/dnd (drag and drop)
- Axios (HTTP client)
- date-fns (date formatting)
- Google Fonts: Syne + DM Sans

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Fetch all tasks |
| GET | `/api/tasks/:id` | Fetch a single task by ID |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update an existing task |
| DELETE | `/api/tasks/:id` | Delete a task |
| PATCH | `/api/tasks/reorder` | Update task order after drag-and-drop |

---

## 📌 How It Works

- Tasks are stored in **MongoDB** with a `status` (todo / inprogress / done) and `order` field
- When a card is dragged, the UI updates instantly and syncs with the backend in the background
- If the API call fails, the board automatically rolls back to the previous state
- Both frontend and backend validate inputs independently

---

## 👩‍💻 Author

**Sakshi Lanjewar**
B.Tech — Artificial Intelligence & Data Science Engineering Student
Passionate about Full Stack Development, MERN Stack, Artificial Intelligence, and building modern web applications.

---

## ⭐ Support

If you like this project, consider giving it a **star on GitHub** ⭐

---

## 📄 License

This project is developed for learning, portfolio, and educational purposes.
