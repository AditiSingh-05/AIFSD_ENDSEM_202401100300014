# AI-Based Employee Performance Analytics & Recommendation System

This is a full-stack MERN application for the ESE case study. It helps HR/Admin users manage employee records, track performance scores, search and filter employees, and generate AI-powered promotion, training, ranking, and feedback recommendations.

## Tech Stack

- Frontend: React + Vite, React Router, Axios, lucide-react
- Backend: Node.js, Express.js, Mongoose
- Database: MongoDB Atlas
- Authentication: JWT + bcrypt password hashing
- AI Provider: OpenRouter/OpenAI-compatible chat completion API

## Main Features

- Signup and login with JWT authentication.
- Protected frontend routes and protected backend APIs.
- Employee registration and edit form.
- Employee list with search and filters.
- Employee CRUD APIs: create, read, update, delete.
- MongoDB schema validation and duplicate email handling.
- AI recommendation API for:
  - Promotion recommendation
  - Employee ranking
  - Training suggestions
  - AI feedback generation
- Responsive dashboard UI with working sidebar navigation.

## Project Structure

```text
client/
  src/
    App.jsx       Main React routes, pages, dashboard, forms, tables
    api.js        Axios API client with JWT token handling
    styles.css    Dashboard styling and responsive layout

server/
  src/
    app.js                 Express app setup
    index.js               Server startup and DB connection
    config/db.js           MongoDB connection
    models/                User, Employee, Recommendation schemas
    controllers/           Auth, employee, and AI logic
    routes/                API route definitions
    middleware/            Auth, async, and error middleware
    utils/seedEmployees.js Demo employee seed data
```

## Local Setup

Install dependencies:

```bash
npm install
```

Create `server/.env`:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5050
JWT_SECRET=replace_with_a_long_random_secret
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=openai/gpt-5.2
CLIENT_URL=http://localhost:5173
```

Run frontend and backend together:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

Backend health check:

```text
http://localhost:5050/api/health
```

## Navigation

All sidebar items now route to real protected pages:

- Dashboard: `/dashboard`
- Employees: `/employees`
- Performance Analytics: `/performance`
- AI Recommendations: `/ai`
- Trainings: `/trainings`
- Reports: `/reports`
- Departments: `/departments`
- Skills: `/skills`
- Users: `/users`
- Roles & Permissions: `/roles`

## API Endpoints

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Employees

- `POST /api/employees`
- `GET /api/employees`
- `GET /api/employees/search?department=Development`
- `PATCH /api/employees/:id`
- `DELETE /api/employees/:id`

### AI

- `POST /api/ai/recommend`

Employee recommendation body:

```json
{
  "mode": "employee",
  "employeeId": "EMPLOYEE_ID"
}
```

Ranking recommendation body:

```json
{
  "mode": "rankings"
}
```

## Test Credentials

Create a new admin through the signup screen or use Postman:

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123"
}
```

## Build

```bash
npm run build --workspace client
```

The frontend production files are generated in `client/dist`.
