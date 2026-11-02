# Task Manager (MERN Stack)

A full-stack task management dashboard built with **MongoDB, Express, React and Node.js**. Create, edit, delete, filter and search tasks, and see live statistics.

## Features

- Add tasks with a title, description and status (Pending, In Progress, Completed)
- View all tasks stored in MongoDB, newest first, with their creation date
- Edit existing tasks
- Delete tasks with a confirmation dialog
- Filter by status: All, Pending, In Progress, Completed
- Search tasks by title (debounced, case-insensitive)
- Statistics: Total, Pending, In Progress, Completed, plus a completion progress bar
- Form validation on both client and server
- Loading skeletons, button spinners, empty states, and success/error messages
- Responsive layout for phones, tablets and desktops

## Tech Stack

| Layer    | Technology                                      |
| -------- | ----------------------------------------------- |
| Frontend | React 19, Vite, Tailwind CSS 4, Axios           |
| Backend  | Node.js, Express 5                              |
| Database | MongoDB with Mongoose                           |

## Project Structure

```
task-manager/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection (reads MONGODB_URI)
│   ├── controllers/
│   │   └── taskController.js     # CRUD + stats logic
│   ├── middleware/
│   │   └── errorMiddleware.js    # 404 + central error handler
│   ├── models/
│   │   └── Task.js               # Mongoose schema and validation
│   ├── routes/
│   │   └── taskRoutes.js         # REST routes
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # App entry point
├── frontend/
│   ├── public/favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── ConfirmDialog.jsx # Delete confirmation
│   │   │   ├── FilterBar.jsx     # Status tabs + search
│   │   │   ├── StatsPanel.jsx    # Task statistics
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskFormModal.jsx # Add / edit form with validation
│   │   │   ├── TaskList.jsx      # Loading, error and empty states
│   │   │   └── Toast.jsx         # Success / error messages
│   │   ├── hooks/useDebounce.js
│   │   ├── services/api.js       # Axios API calls
│   │   ├── utils/                # constants + date formatting
│   │   ├── App.jsx               # State and page layout
│   │   ├── index.css             # Tailwind + theme
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- MongoDB, either:
  - a local installation ([MongoDB Community Server](https://www.mongodb.com/try/download/community)), or
  - a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas)

## Setup and Run (Local Development)

### 1. Backend

```bash
cd backend
npm install
copy .env.example .env      # PowerShell / cmd
```

Open `backend/.env` and fill in your values:

```env
PORT=5000
CLIENT_URL=http://localhost:5174
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/task-manager
```

Start the API:

```bash
npm run dev      # development — restarts on file changes (nodemon)
# or
npm start        # production-style start
```

The API runs at **http://localhost:5000**. Verify with:
`curl http://localhost:5000/api/health`

### 2. Frontend

Open a second terminal:

```bash
cd frontend
npm install
copy .env.example .env      # PowerShell / cmd
npm run dev
```

The app runs at **http://localhost:5174**.

To create a production build: `npm run build` (output in `frontend/dist`).

---

## Production Deployment

### Prerequisites

- A free [MongoDB Atlas](https://mongodb.com/atlas) cluster (already connected).
- A [GitHub](https://github.com) account with this repo pushed (`.env` files are git-ignored — only `.env.example` is committed).
- A [Render](https://render.com) account (backend).
- A [Vercel](https://vercel.com) account (frontend).

---

### Step 1 — Push to GitHub

```bash
# From task-manager/ (the root that contains .gitignore)
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

> **Double-check**: `.env` files must **not** appear in `git status` before you push.

---

### Step 2 — Deploy the Backend on Render

1. Go to <https://dashboard.render.com> → **New → Web Service**.
2. Connect your GitHub repo.
3. Configure the service:

   | Field | Value |
   |---|---|
   | **Root directory** | `task-manager/backend` |
   | **Environment** | `Node` |
   | **Build command** | `npm install` |
   | **Start command** | `npm start` |

4. Under **Environment Variables**, add:

   | Key | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | your Atlas connection string |
   | `CLIENT_URL` | *(leave blank for now — fill in after Step 3)* |

5. Click **Create Web Service**. Render builds and starts the server.
6. Copy the public URL, e.g. `https://task-manager-api.onrender.com`.
7. Verify: open `https://task-manager-api.onrender.com/api/health` — you should see `{"success":true}`.

---

### Step 3 — Deploy the Frontend on Vercel

1. Go to <https://vercel.com> → **Add New → Project**.
2. Import your GitHub repo.
3. Configure:

   | Field | Value |
   |---|---|
   | **Root directory** | `task-manager/frontend` |
   | **Framework preset** | `Vite` |
   | **Build command** | `npm run build` |
   | **Output directory** | `dist` |

4. Under **Environment Variables**, add:

   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://task-manager-api.onrender.com/api` |

5. Click **Deploy**. Vercel builds the app and gives you a URL like `https://task-manager.vercel.app`.

---

### Step 4 — Wire the two services together

1. **Back on Render**, go to your web service → **Environment** tab.
2. Set `CLIENT_URL` to your Vercel URL (e.g. `https://task-manager.vercel.app`) — **no trailing slash**.
3. Render automatically redeploys. CORS is now configured for the live frontend.

---

### Step 5 — Verify end-to-end

Open your Vercel URL in the browser and confirm:

- [ ] Task list loads (or shows the empty state if no tasks yet)
- [ ] Stats panel shows correct counts
- [ ] **Create** — Add task → appears in list
- [ ] **Update** — Edit task → changes saved
- [ ] **Delete** — Delete task → removed with confirmation
- [ ] **Filter / Search** — Results update correctly

> **Render cold-start note**: The free Render tier spins down idle services after 15 minutes. The first request after a sleep may take 20–30 seconds. This is normal on the free plan.

## Environment Variables

**backend/.env**

| Variable      | Description                                   | Default                 |
| ------------- | --------------------------------------------- | ----------------------- |
| `PORT`        | Port for the Express server                   | `5000`                  |
| `CLIENT_URL`  | Frontend origin allowed by CORS               | `http://localhost:5174` |
| `MONGODB_URI` | MongoDB connection string (**required**)      | none                    |

**frontend/.env**

| Variable       | Description              | Default                     |
| -------------- | ------------------------ | --------------------------- |
| `VITE_API_URL` | Base URL of the REST API | `http://localhost:5000/api` |

Real `.env` files are listed in `.gitignore`. Only the `.env.example` templates are committed, and no credentials are hardcoded anywhere.

## REST API

Base URL: `http://localhost:5000/api`

| Method | Endpoint           | Description                         |
| ------ | ------------------ | ----------------------------------- |
| GET    | `/tasks`           | List tasks (newest first)           |
| GET    | `/tasks/stats`     | Counts: total and per status        |
| GET    | `/tasks/:id`       | Get one task                        |
| POST   | `/tasks`           | Create a task                       |
| PUT    | `/tasks/:id`       | Update a task                       |
| DELETE | `/tasks/:id`       | Delete a task                       |
| GET    | `/api/health`      | Health check                        |

**Query parameters for `GET /tasks`**

- `status`: `All`, `Pending`, `In Progress` or `Completed`
- `search`: case-insensitive match on the title

Example: `GET /api/tasks?status=In%20Progress&search=api`

**Task body (POST / PUT)**

```json
{
  "title": "Write API docs",
  "description": "Document all endpoints",
  "status": "Pending"
}
```

| Field         | Rules                                                     |
| ------------- | --------------------------------------------------------- |
| `title`       | Required, 3 to 100 characters                             |
| `description` | Optional, up to 500 characters                            |
| `status`      | `Pending` (default), `In Progress` or `Completed`         |

**Success response**

```json
{ "success": true, "message": "Task created", "data": { "_id": "...", "title": "...", "status": "Pending", "createdAt": "...", "updatedAt": "..." } }
```

**Error response**

```json
{ "success": false, "message": "Title must be at least 3 characters", "errors": [{ "field": "title", "message": "..." }] }
```

Status codes: `200` OK, `201` Created, `400` validation or invalid id, `404` not found, `500` server error.

### Try it with curl

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn MERN","status":"In Progress"}'

curl http://localhost:5000/api/tasks
curl http://localhost:5000/api/tasks/stats
```

## How It Works

- **Models** define the data shape and validation (`models/Task.js`).
- **Routes** map URLs to controller functions (`routes/taskRoutes.js`).
- **Controllers** hold the logic for each endpoint and pass errors to `next()` (`controllers/taskController.js`).
- **Error middleware** turns Mongoose and JSON errors into clear 400/404/500 responses.
- **`services/api.js`** is the only place in the frontend that calls Axios, so components stay simple.
- **`App.jsx`** owns the state (tasks, stats, filters, modals) and refreshes the list and stats after every change.
- Search input is **debounced** (400 ms) and stale responses are ignored, so fast typing never shows outdated results.

## Troubleshooting

| Problem                                    | Fix                                                                                      |
| ------------------------------------------ | ---------------------------------------------------------------------------------------- |
| `MONGODB_URI is missing`                   | Create `backend/.env` from `.env.example`.                                               |
| `MongoDB connection failed`                | Make sure MongoDB is running, or check your Atlas credentials and IP allow-list.         |
| "Cannot reach the server" in the browser   | Start the backend, and check `VITE_API_URL` in `frontend/.env`.                          |
| CORS error                                 | Set `CLIENT_URL` in `backend/.env` to the exact URL of the frontend and restart the API. |
| Changed `.env` but nothing happened        | Restart the dev server. Vite and Node only read `.env` at startup.                       |

## License

MIT
