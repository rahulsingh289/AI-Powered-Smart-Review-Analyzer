# AI-Powered Smart Review Analyzer

An intelligent review analysis platform that automatically classifies customer sentiments, identifies themes, and generates contextual response templates using natural language processing.

## 🚀 Features

- **Sentiment Analysis**: Automatically detects Positive, Negative, or Neutral sentiments from review text
- **Theme Classification**: Categorizes reviews into themes: Food/Host, Cleanliness, Facilities, Value, Location
- **AI-Powered Responses**: Generates contextual, professional responses based on sentiment and theme
- **Multi-Language Support**: Translate responses to Spanish, French, and German
- **Multiple Response Tones**: Choose from Professional, Casual, Empathetic, or Concise tones
- **Real-Time Dashboard**: View sentiment breakdowns, theme distributions, and review statistics
- **Full CRUD Operations**: Create, Read, Update, and Delete reviews via REST API
- **Dark/Light Mode**: Premium UI with amber/gold theme and dark mode support
- **Persistent Storage**: PostgreSQL database with Prisma ORM for reliable data persistence

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL (local or Supabase cloud)
- **ORM**: Prisma
- **APIs**: RESTful API with CORS support

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS with custom premium theme
- **State Management**: React Hooks (useState, useEffect)

---

## Database Choice & Architecture

For Week 5, we have migrated the application data storage from an in-memory array to a persistent relational database:

*   **Database:** **PostgreSQL** (running locally / hosted via Supabase in production)
*   **ORM:** **Prisma ORM**
*   **Rationale:** The review analyzer works with structured entities (Users, Reviews, and Theme/Settings) that have clear, well-defined relationships. PostgreSQL provides ACID compliance and robust relational capabilities. Prisma ORM enables type safety, migrations, and declarative schema modeling.

---

## Schema Diagram (ERD)

The database schema consists of three core entities:
1.  **User**: Represents users who can log in and manage reviews.
2.  **Review**: Represents customer reviews, including parsed sentiments, themes, date, and AI-suggested responses.
3.  **ThemeSetting**: Configures default response tones for each review category/theme.

Here is the database schema diagram:

![Database Schema Diagram](./W5_SchemaDiagram_TBI-26100161.png)

---

## Setup and Database Configuration

### Prerequisites
- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher) installed and running locally, OR
- **Supabase** account for cloud PostgreSQL hosting
- **npm** or **yarn** package manager

### 1. Clone the Repository
```bash
git clone https://github.com/rahulsingh289/AI-Powered-Smart-Review-Analyzer.git
cd AI-Powered-Smart-Review-Analyzer
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend/` directory by copying `.env.example`:
```bash
cp backend/.env.example backend/.env
```

Update your `.env` with your PostgreSQL connection string:

**For Local PostgreSQL:**
```env
PORT=5001
DATABASE_URL="postgresql://username:password@localhost:5432/review_analyzer"
```

**For Supabase (Cloud):**
```env
PORT=5001
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

> **Note:** Replace `username`, `password`, and database name with your actual PostgreSQL credentials.

### 3. Install Dependencies
Install packages for both backend and frontend:

```bash
# Install backend packages
cd backend
npm install

# Install frontend packages
cd ../frontend
npm install
cd ..
```

### 4. Initialize Database and Run Migrations
Generate the Prisma Client and create database tables:

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
```

This will:
- Generate the Prisma Client for type-safe database access
- Create the `User`, `Review`, and `ThemeSetting` tables in your PostgreSQL database
- Apply all migrations from `prisma/migrations/` folder

**Optional:** View your database in Prisma Studio:
```bash
npx prisma studio
```
This opens a GUI at `http://localhost:5555` to view and edit your database.

### 5. Running the Application Locally

#### Start Backend Server
```bash
cd backend
npm run dev
```
- Backend API runs on `http://localhost:5001`
- Automatically seeds database with 5 initial reviews on first startup
- All 7 REST API endpoints are available (GET, POST, PUT, DELETE)

#### Start Frontend Server
In a new terminal:
```bash
cd frontend
npm run dev
```
- Frontend Vite server runs on `http://localhost:5173`
- Open `http://localhost:5173` in your browser

### 6. API Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reviews` | List all reviews (supports filters: q, sentiment, theme) |
| GET | `/api/reviews/stats` | Get dashboard statistics (sentiment breakdown, themes) |
| GET | `/api/reviews/:id` | Get single review by ID |
| POST | `/api/reviews` | Analyze and add new reviews (bulk text input) |
| PUT | `/api/reviews/:id` | Update existing review |
| DELETE | `/api/reviews/:id` | Delete review by ID |
| POST | `/api/reviews/reset` | Reset database to initial 5 mock reviews |

### 7. Troubleshooting

**Database Connection Error:**
- Ensure PostgreSQL is running: `psql -U postgres` (local)
- Verify connection string in `.env` is correct
- Check if database exists: `psql -U postgres -c "\l"`

**Prisma Client Not Generated:**
```bash
cd backend
npx prisma generate
```

**Port Already in Use:**
- Change `PORT` in `backend/.env` to a different port (e.g., 5002)
- Change Vite port in `frontend/vite.config.js`

**Migration Issues:**
```bash
cd backend
npx prisma migrate reset  # Resets DB and reruns all migrations
```


## 📁 Project Structure

```
AI-Powered-Smart-Review-Analyzer/
├── backend/
│   ├── prisma/
│   │   ├── migrations/       # Database migration files
│   │   └── schema.prisma     # Database schema definition
│   ├── .env                  # Environment variables (not committed)
│   ├── .env.example          # Example environment file
│   ├── server.js             # Express API server with all endpoints
│   └── package.json          # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── ui/          # Base UI components (Button, Input, etc.)
│   │   │   ├── NavBar.jsx
│   │   │   ├── DashboardLayout.jsx
│   │   │   └── ...
│   │   ├── pages/           # Application pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AnalyzeReviews.jsx
│   │   │   ├── ReviewHistory.jsx
│   │   │   ├── Reports.jsx
│   │   │   ├── Settings.jsx
│   │   │   └── Login.jsx
│   │   ├── App.jsx          # Main app component with routing
│   │   ├── main.jsx         # React entry point
│   │   └── index.css        # Global styles with Tailwind
│   └── package.json         # Frontend dependencies
├── W5_SchemaDiagram_TBI-26100161.png  # Database ERD
└── README.md                # This file
```

## 📄 License

This project is created for educational purposes as part of the AI-Assisted Full Stack Web Development Internship Program.

## 👤 Author

**Rahul Singh**
- Intern ID: TBI-26100161
- GitHub: [@rahulsingh289](https://github.com/rahulsingh289)

---


