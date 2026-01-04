# Neighborhood Community Help Portal

A secure, role-based platform designed to connect people in the neighborhood who need help (Residents) with those willing to provide it (Helpers).

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.x or higher
- **MySQL**: Running on localhost
- **NPM**: v9.x or higher

---

### Step 1: Database Setup
1. Open your MySQL terminal/Workbench.
2. Create the database and tables using the provided schema:
   ```sql
   SOURCE c:/Users/vamsi/Downloads/Neighborhood Community/backend/schema.sql;
   ```
3. Update the database schema to include security patches:
   ```bash
   cd "backend"
   npm install
   npx ts-node src/scripts/update_schema.ts
   ```

---

### Step 2: Backend Configuration
1. Navigate to the backend folder:
   ```bash
   cd "backend"
   ```
2. Create a `.env` file (if not present) with the following:
   ```env
   PORT=3002
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password_here
   DB_NAME=neighborhood_community
   JWT_SECRET=supersecretneighborhoodkey123
   ```
3. Start the backend server:
   ```bash
   npm run dev
   ```
   *The server will run on [http://localhost:3002](http://localhost:3002)*

---

### Step 3: Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd "frontend"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Angular development server:
   ```bash
   npm start
   ```
   *The application will be available at [http://localhost:4201](http://localhost:4201)*

---

## 🛠 Features & Roles

### 1. Secure Authentication
- **Registration**: Users must register with their Name, Email, Role, and Password.
- **Login**: Secured with JWT (JSON Web Tokens) and bcrypt password hashing.

### 2. Role-Based Access (RBAC)
- **Resident (Need Help)**:
    - Post new help requests (with file attachments).
    - Track the status of their own requests.
    - View private activity history.
- **Helper (Willing to Help)**:
    - Browse the "Help Marketplace".
    - Accept available tasks.
    - Manage and update the status of tasks they've accepted (Accepted -> In-Progress -> Completed).

---

## 🏗 Technology Stack
- **Frontend**: Angular 18+, Angular Material, SCSS.
- **Backend**: Node.js, Express, TypeScript.
- **Database**: MySQL.
- **Security**: JWT, BcryptJS, Express Validator.

## 📁 Project Structure
- `/backend`: Express API, JWT middleware, DB controllers.
- `/frontend`: Angular components, AuthService, Route Guards.
- `schema.sql`: Initial database definitions.




LOGIN PAGE :











NEW USE


USER HELP REQUESTS :




USER HELP FORM: 


Helper Interface :




Helper Tasks given by user UI :







