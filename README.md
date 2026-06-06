# 🚀 TaskFlow — MERN Kanban Dashboard

A full-stack Kanban-style Task Management App built with the MERN stack — MongoDB, Express, React, and Node.js.
I built this project to practice full-stack development, focusing on clean code structure, REST API design, and a smooth drag-and-drop UI experience.

## ✨ Features

| Feature | Details |

1. 📋 Kanban Board — Three columns: To Do, In Progress, Done
2. 🖱️ Drag & Drop — Move tasks between columns, order updates automatically
3. ✅ Full CRUD — Add, edit, and delete tasks
4. 🎨 Priority Badges — High 🔴 / Medium 🟡 / Low 🟢 with color-coded cards
5. 📅 Due Dates — Shows overdue and "due today" warnings
6. 🔍 Priority Filter — Filter all columns by priority level
7. 📊 Progress Bar — Live completion percentage in the header
8. 📱 Responsive Design — Works on mobile and desktop


## 🔐 Authentication Pages
1. Sign In (Login)

Enter your registered Email and Password
Click "Sign In" button
On success → redirected to your Dashboard

Options available on Sign In page:

🔗 "Forgot Password?" — click to reset your password
🔗 "Register Here" — click to create a new account

2. Register (Sign Up)

Fill in your Full Name, Email, Password, Confirm Password
Click "Register" → automatically logged in and redirected to Dashboard


3. Forgot Password

Enter your registered Email Address
Click "Send Reset Link"
Check your email → Click the reset link → Enter new password ✅

## 🏗 Project Structure

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

### 🚀 Getting Started

Requirements

Node.js v18 or higher
MongoDB running locally on port 27017

Installation

# Step 1 — Install all dependencies
npm run install:all

# Step 2 — Setup environment file
cp server/.env.example server/.env

# Step 3 — Start the app
npm run dev


- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000

### Task Object Shape

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

## 🛠 Tech Stack

**Backend**
- Node.js + Express 4
- MongoDB + Mongoose 7
- express-validator (input validation)
- dotenv, cors

**Frontend**
- React 18 (functional components + hooks)
- React Context + useReducer (state management)
- @hello-pangea/dnd (drag and drop)
- Axios (HTTP client)
- date-fns (date formatting)
- Google Fonts: Syne + DM Sans

## 🌐 API Endpoints

| Method | Endpoint             | Description                           |
| ------ | -------------------- | ------------------------------------- |
| GET    | `/api/tasks`         | Fetch all tasks                       |
| GET    | `/api/tasks/:id`     | Fetch a single task by ID             |
| POST   | `/api/tasks`         | Create a new task                     |
| PUT    | `/api/tasks/:id`     | Update an existing task               |
| DELETE | `/api/tasks/:id`     | Delete a task                         |
| PATCH  | `/api/tasks/reorder` | Update task order after drag-and-drop |


## 📌 How It Works

1. Tasks are stored in MongoDB with a status (todo / inprogress / done) and order field
2. When a card is dragged, the UI updates instantly and syncs with the backend in the background
3. If the API call fails, the board automatically rolls back to the previous state
4. Both frontend and backend validate inputs independen

## 👩‍💻 Author

Sakshi

B.Tech Artificial Intelligence & Data Science Engineering Student

Passionate about Full Stack Development, MERN Stack, Artificial Intelligence, and building modern web applications.


## ⭐ Support

If you like this project, consider giving it a star on GitHub.


## 📄 License

This project is developed for learning, portfolio, and educational purposes.