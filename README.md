# Luxury Sense - High-End E-Commerce Platform

A premium e-commerce application built with **React (Vite)** for the frontend and **Laravel 11** for the backend.

## 🛠 Prerequisites

Ensure you have the following installed on your system:

- **PHP 8.2 or higher**
- **Composer** (PHP Package Manager)
- **Node.js & npm** (LTS version recommended)
- **MySQL Server**
- **Git**

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd luxury-sense
```

### 2. Backend Setup (Laravel)

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install PHP dependencies:**
   ```bash
   composer install
   ```

3. **Configure Environment Variables:**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Open `.env` and configure your database settings:
     ```env
     DB_CONNECTION=mysql
     DB_HOST=127.0.0.1
     DB_PORT=3306
     DB_DATABASE=luxury_sense_db
     DB_USERNAME=root
     DB_PASSWORD=your_password
     ```
   - **Important:** Configure your Mail settings in `.env` for signup verification to work:
     ```env
     MAIL_MAILER=smtp
     MAIL_HOST=smtp.gmail.com
     MAIL_PORT=587
     MAIL_USERNAME=your_email@gmail.com
     MAIL_PASSWORD="your_app_password"
     MAIL_ENCRYPTION=tls
     MAIL_FROM_ADDRESS=your_email@gmail.com
     ```

4. **Generate Application Key:**
   ```bash
   php artisan key:generate
   ```

5. **Run Migrations & Seeders:**
   - Create a database named `luxury_sense_db` in your MySQL server.
   - Run the following:
     ```bash
     php artisan migrate --seed
     ```
     *Note: This will create the default admin user: `admin@luxurysense.test` / `Admin@12345`*

6. **Start the Backend Server:**
   ```bash
   php artisan serve
   ```
   The backend will run at `http://127.0.0.1:8000`.

---

### 3. Frontend Setup (React + Vite)

1. **Navigate back to the root directory:**
   ```bash
   cd ..
   ```

2. **Install npm dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   - Create a `.env` file in the root directory:
     ```env
     VITE_API_URL=http://localhost:8000/api
     ```

4. **Start the Frontend Development Server:**
   ```bash
   npm run dev
   ```
   The frontend will usually run at `http://localhost:5173`.

---

## 🔑 Admin Access

- **Dashboard:** Navigate to `/admin` in the frontend.
- **Default Credentials:**
  - **Email:** `admin@luxurysense.test`
  - **Password:** `Admin@12345`

## 📁 Project Structure

- `/src`: React frontend source code (Components, Pages, Contexts).
- `/backend`: Laravel API source code (Controllers, Models, Migrations).
- `/backend/database/migrations`: Database schema definitions.
- `/backend/app/Http/Controllers`: Backend logic for Auth, Products, Customers, and Orders.

## 📝 Common Troubleshooting

- **Mail Error (`getaddrinfo failed`):** Restart your `php artisan serve` process. Ensure your internet connection is stable.
- **Database Connection Error:** Verify MySQL service is running and credentials in `backend/.env` match your local setup.
- **Port Already in Use:** If port 5173 is used, Vite will automatically try 5174. Ensure `VITE_API_URL` correctly points to the running Laravel server.
