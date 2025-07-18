# AYNA - Feedback Collection Platform

A full-stack web application built with the MERN stack that allows businesses to create feedback forms and collect responses from customers.

## 📚 Documentation

- **[User Guide](USER_GUIDE.md)** - Complete guide for using the platform
- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Instructions for deploying to production
- **[Backend Documentation](AYNA_Backend_Documentation.md)** - Detailed backend code documentation

## Features

- Admin authentication (register/login)
- Create customizable feedback forms with text and multiple-choice questions
- Generate public URLs for form sharing
- Public form submission (no login required)
- Admin dashboard to view all forms and responses
- **CSV Export**: Export form responses to CSV format
- Tabular view of responses with detailed analytics
- Mobile-responsive design with modern UI

## Tech Stack

- **Frontend**: React, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: CSS3

## Project Structure

```
feedback-platform/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Form.js
│   │   └── Response.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── forms.js
│   │   └── responses.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Dashboard.js
    │   │   ├── CreateForm.js
    │   │   ├── PublicForm.js
    │   │   └── FormResponses.js
    │   ├── contexts/
    │   │   └── AuthContext.js
    │   ├── services/
    │   │   └── api.js
    │   └── App.js
    └── public/
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd feedback-platform
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Set up environment variables
Create a `.env` file in the backend directory:
```env
JWT_SECRET=your-secret-key-here
MONGODB_URI=mongodb://localhost:27017/feedback-platform
PORT=5000
```

5. Start MongoDB
Make sure MongoDB is running on your system

6. Start the backend server
```bash
cd backend
npm run dev
```

7. Start the frontend development server
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

## Usage

### For Admins:
1. Register a new account or login
2. Create feedback forms with custom questions
3. Share the generated public URL
4. View responses in the dashboard
5. Export responses to CSV

### For Customers:
1. Access the public form URL
2. Fill out the feedback form
3. Submit responses (no login required)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new admin
- `POST /api/auth/login` - Login admin

### Forms
- `POST /api/forms` - Create new form
- `GET /api/forms` - Get all forms for logged-in admin
- `GET /api/forms/:id` - Get form by ID (public)
- `PUT /api/forms/:id` - Update form
- `DELETE /api/forms/:id` - Delete form

### Responses
- `POST /api/responses` - Submit form response (public)
- `GET /api/responses/form/:formId` - Get responses for specific form
- `GET /api/responses/dashboard` - Get dashboard data
- `GET /api/responses/export/:formId` - Export responses as CSV (authenticated)

## Design Decisions

1. **JWT Authentication**: Used for admin authentication to maintain stateless sessions
2. **Public Form Access**: Forms are publicly accessible via unique URLs without authentication
3. **MongoDB**: Chosen for flexible document storage suitable for dynamic form structures
4. **Context API**: Used for state management to avoid prop drilling
5. **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox
6. **Component Structure**: Modular components for maintainability and reusability
