# 🌿 Willow Blog — Full Stack MERN Application

A complete blog platform with authentication, posts, likes, saves, nested comments, topic following, and in-app notifications.

---

## 📁 Project Structure

```
willow-blog-fullstack/
├── backend/               ← Node.js + Express + MongoDB
│   ├── src/
│   │   ├── config/        ← MongoDB connection
│   │   ├── controllers/   ← Business logic
│   │   ├── middleware/    ← JWT auth guard
│   │   ├── models/        ← Mongoose schemas
│   │   ├── routes/        ← API route definitions
│   │   └── server.js      ← Entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/              ← React + Vite
    ├── src/
    │   ├── api/           ← Axios instance
    │   ├── components/    ← Navbar, Login, FP, Categories...
    │   ├── context/       ← AuthContext (global user state)
    │   ├── pages/         ← Home, Blog, PostDetail, CreatePost...
    │   └── styles/        ← All CSS files
    ├── .env
    └── package.json
```

---

## ⚙️ Setup Instructions

### Step 1 — MongoDB Atlas

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and create a free account
2. Create a new cluster (free tier is fine)
3. Click **Connect → Drivers → Node.js**
4. Copy the connection string — it looks like:
   ```
   mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/
   ```
5. Add `/willow-blog` before the `?` — so it becomes:
   ```
   mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/willow-blog?retryWrites=true&w=majority
   ```

---

### Step 2 — Backend Setup

```bash
cd backend

# Copy env file and fill in your values
cp .env.example .env
```

Open `.env` and set:
```
PORT=5000
MONGO_URI=<your MongoDB connection string from Step 1>
JWT_SECRET=any_random_secret_string_you_choose
```

Then install and run:
```bash
npm install
npm run dev
```

You should see:
```
🌿 Willow Blog server running on port 5000
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
```

---

### Step 3 — Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit: **http://localhost:5173**

---

### Step 4 — Create Your Admin Account

The first user who registers gets `role: "user"` by default.
To make yourself admin so you can write posts:

1. Register normally on the site
2. Open MongoDB Atlas → Browse Collections → `users`
3. Find your user document
4. Change `"role": "user"` to `"role": "admin"`
5. Log out and log back in

Now you'll see the **+ Write** button in the navbar.

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user (requires token) |

### Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | Get all posts (supports `?tag=`, `?search=`, `?page=`, `?limit=`) |
| GET | `/api/posts/featured` | Get top 3 most liked posts |
| GET | `/api/posts/:id` | Get single post |
| POST | `/api/posts` | Create post (admin only) |
| PUT | `/api/posts/:id` | Update post (admin only) |
| DELETE | `/api/posts/:id` | Delete post (admin only) |
| POST | `/api/posts/:id/like` | Like / Unlike a post |
| POST | `/api/posts/:id/save` | Save / Unsave a post |

### Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/comments/:postId` | Get comments for a post |
| POST | `/api/comments/:postId` | Add a comment or reply |
| DELETE | `/api/comments/:id` | Delete a comment |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Get my profile |
| PUT | `/api/users/profile` | Update profile |
| POST | `/api/users/follow-topic` | Follow / Unfollow a topic |
| GET | `/api/users/saved` | Get saved posts |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get my notifications |
| PUT | `/api/notifications/read-all` | Mark all as read |

---

## ✨ Features

- **Authentication** — JWT-based register/login, persistent sessions
- **Blog Posts** — Create, read, edit, delete (admin); search by keyword, filter by tag, pagination
- **Like System** — Like/unlike any post, count updates in real time
- **Save System** — Bookmark posts to a personal reading list
- **Nested Comments** — Comment on posts; reply to any comment
- **Topic Following** — Follow topics like "Tech" or "Lifestyle" and get notified of new posts
- **In-App Notifications** — Bell icon with unread count, auto-refreshes every 30 seconds
- **Admin Panel** — Admin role can write, edit, and delete posts via the UI
- **Responsive Design** — Works on desktop and mobile

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, React Router v7, Axios, Vite |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT (JSON Web Tokens), bcryptjs |
| Styling | Custom CSS with CSS Variables |

---

## 🚀 Running Both Together

Open two terminals:

**Terminal 1 (Backend):**
```bash
cd backend && npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend && npm run dev
```

Then open **http://localhost:5173** 🌿
