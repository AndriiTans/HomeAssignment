# Music Search Application

A full-stack web application for searching and displaying music information. Built with React and Node.js.

## Features

- User authentication with JWT
- Real-time music search
- Paginated results
- Sortable and filterable data tables
- Responsive design
- Token refresh mechanism

## Tech Stack

### Frontend
- React
- Material-UI
- React Router
- Axios

### Backend
- Node.js
- Express
- JWT Authentication

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd music-search-app
```

2. Install dependencies for both frontend and backend:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=3000
JWT_SECRET=your_jwt_secret
```

4. Start the development servers:

```bash
# Start backend server (from backend directory)
npm run dev

# Start frontend server (from frontend directory)
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- POST `/api/auth/verify` - Verify JWT token
- POST `/api/auth/refresh` - Refresh JWT token

### Search
- GET `/api/search` - Search for music
  - Query parameters:
    - `searchBy`: Search term

## Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   └── package.json
└── README.md
```
