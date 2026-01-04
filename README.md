# 🏙️ Neighborhood Community Help Portal

A premium, role-based platform designed to connect people in the neighborhood who need help (**Residents**) with those willing to provide it (**Helpers**). This application features a secure authentication system, real-time data status tracking, and a role-specific UI design.

---

## 🎨 Role-Based Interface
To enhance user experience and prevent confusion, the application features two distinct visual themes:
- **Resident Side (Lite Orange)**: A warm, welcoming theme for those requesting help.
- **Helper Side (Deep Blue)**: A professional, focused theme for those volunteering their time.

---

## 🛠️ Technology Stack & Tools

### Frontend
- **Framework**: [Angular 21+](https://angular.io/)
- **UI Components**: [Angular Material](https://material.angular.io/)
- **Styling**: SCSS (Mobile-responsive design)
- **Icons**: Google Material Icons
- **State Management**: RxJS Observables & Services

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MySQL](https://www.mysql.com/)
- **Authentication**: JWT (JSON Web Tokens) & Bcrypt.js (Password hashing)
- **Validation**: Express Validator

---

## 🚀 Installation & Setup Guide

### 1. Prerequisites
Before running the application, ensure you have the following installed:
- **Node.js**: [Download here](https://nodejs.org/) (v18 or higher recommended)
- **MySQL Server**: [Download here](https://dev.mysql.com/downloads/installer/)
- **Angular CLI**: Install via npm: `npm install -g @angular/cli`

---

### 2. Database Configuration
1. **Initialize the Schema**:
   Open your MySQL Command Line or Workbench and run:
   ```sql
   CREATE DATABASE neighborhood_community;
   USE neighborhood_community;
   SOURCE /absolute/path/to/project/backend/schema.sql;
   ```
   > [!NOTE]
   > The database schema has been hardened to ensure all users must have an email and a secure password.

---

### 3. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables. Create a `.env` file in the `backend` folder:
   ```env
   PORT=3002
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=neighborhood_community
   JWT_SECRET=your_secret_key_here
   ```
4. Start the backend in development mode:
   ```bash
   npm run dev
   ```

---

### 4. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm start
   ```
4. Access the application at: **[http://localhost:4201](http://localhost:4201)**

---

## 📁 Project Structure

```text
/backend
├── src/
│   ├── config/      # Database connection
│   ├── controllers/ # Auth & Request logic
│   ├── middleware/  # JWT & Validation
│   ├── routes/      # API Endpoints
│   └── scripts/     # Utility scripts
└── schema.sql       # MySQL Database definitions

/frontend
├── src/app/
│   ├── core/        # Shared services, guards, navbar
│   ├── features/    # Login, Register, Dashboard, Marketplace
│   └── app.ts       # Dynamic theme logic
└── styles.scss      # Global theme variables (Orange/Blue)
```

## 🔐 Security Features
- **Password Hashing**: Uses `bcryptjs` with a salt factor of 10.
- **Protected Routes**: Angular Route Guards prevent unauthorized access to the dashboard.
- **JWT Authorization**: All private API calls require a valid Bearer token.
- **Input Sanitization**: Backend requests are validated using `express-validator`.

---

## 👨‍💻 Developer Tools Used
- **VS Code**: Primary Editor
- **MySQL Workbench**: Database Management
- **Git**: Version Control
- **Postman/Insomnia**: API Testing during development
- **Nodemon**: Auto-restarting backend server
