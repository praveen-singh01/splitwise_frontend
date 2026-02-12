# Splitwise Frontend

React frontend for the Splitwise-like expense tracker application.

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

## Features

- ✅ User authentication (Login/Signup)
- ✅ Dashboard with expense list and filters
- ✅ Add/Edit expenses with equal and percentage splits
- ✅ Balance calculations with settlement optimization
- ✅ Protected routes
- ✅ Responsive design

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will run on `http://localhost:3000`

## Backend Connection

The frontend connects to the backend API at `http://localhost:5000`. Make sure the backend server is running before using the frontend.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
