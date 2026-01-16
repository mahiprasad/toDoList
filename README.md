## toDoList (Express + EJS + MongoDB)

This app is **not static frontend-only** — it’s a Node/Express server that renders **EJS** templates and stores todos in **MongoDB** (via Mongoose).

### Prerequisites

- **Node.js**: install Node 18+ (or any modern LTS)
- **MongoDB**: either
  - **Local MongoDB** running on your machine, or
  - a **MongoDB Atlas** cluster (cloud)

### Setup

1) Install dependencies:

```bash
cd /Users/mahi-prasad/gH/toDoList
npm install
```

2) Create a `.env` file:

- Copy `env.example` to `.env` and update values:

```bash
cp env.example .env
```

- If you are using **MongoDB Atlas**, set `MONGODB_URI` to your Atlas connection string.
- If you are using **local MongoDB**, the default in `env.example` should work:
  - `mongodb://127.0.0.1:27017/todolistDb`

### Run

```bash
npm start
```

Open the app:
- `http://localhost:3000` (or whatever `PORT` you set in `.env`)

### Troubleshooting

- **MongoDB connection error**: ensure `MONGODB_URI` is correct and reachable, and that your IP is allowed in Atlas (Network Access), or that local MongoDB is running.