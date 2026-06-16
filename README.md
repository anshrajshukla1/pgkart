# 🛒 PGKart

Welcome to **PGKart**! This is a modern, full-stack e-commerce platform specifically tailored for students living in Hostels and PGs. Moving to a new city can be overwhelming, and finding those essential day-to-day items (like buckets, study lamps, toiletries, and bedding) shouldn't be a hassle. PGKart solves this by bringing everything a student needs into one place, with fast delivery and student-friendly prices.

## ✨ Features

### For Students (Users)
- **Seamless Shopping Experience:** A beautifully designed, responsive user interface built for speed and ease of use.
- **Easy Authentication:** Sign up the traditional way with an email and password, or use 1-click **Google OAuth** login.
- **Smart Cart & Checkout:** Add products to your cart, apply discount coupons, and securely checkout.
- **Secure Payments:** Integrated directly with **Razorpay** for seamless, secure online transactions (UPI, Cards, NetBanking).
- **Email Notifications:** Automatic email updates sent directly to your inbox for order confirmations, shipping updates, and delivery notifications.
- **Order Tracking & History:** View your past orders, check their live status, and easily request returns if needed.

### For Administrators
- **Comprehensive Admin Dashboard:** A dedicated, secure dashboard to manage the entire store.
- **Product & Category Management:** Easily add, edit, and delete products and categories. Upload product images directly via **Cloudinary**.
- **Order Fulfillment:** View all incoming orders, track their payment status, and update their delivery status (which automatically triggers emails to the customer).
- **Coupons & Discounts:** Create custom discount codes (Flat amount or Percentage) with minimum order value requirements to run sales and promotions.
- **Featured Products:** Highlight specific products to appear directly on the homepage for maximum visibility.

## 🛠️ Technology Stack

PGKart is built using a robust, enterprise-grade technology stack:

**Frontend:**
- **React (Vite):** Fast, modern frontend framework.
- **Redux Toolkit:** For global state management (cart, auth, etc.).
- **React Router:** For seamless single-page application navigation.
- **CSS:** Custom, vanilla CSS for a unique, vibrant, and responsive design system.

**Backend:**
- **Java & Spring Boot:** Providing a rock-solid, scalable RESTful API architecture.
- **Spring Security (JWT):** Ensuring endpoints are protected and user sessions are securely managed via JSON Web Tokens.
- **PostgreSQL:** A powerful open-source relational database for storing all app data.
- **Hibernate / JPA:** ORM for seamless database interactions.
- **Flyway:** Automated database migrations for version-controlled schema updates.

**Third-Party Integrations:**
- **Razorpay:** Payment Gateway.
- **Cloudinary:** Cloud Image Storage.
- **Google OAuth:** Social Login.
- **Gmail API (SMTP):** Transactional Emails.

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
- Node.js (v18+)
- Java JDK (v17+)
- PostgreSQL (v14+)
- Maven

### 1. Database Setup
Create a PostgreSQL database named `pgkart`.
```sql
CREATE DATABASE pgkart;
```

### 2. Backend Setup
Navigate to the root of the project. You'll need to configure your environment variables. 
You can either set them in your system environment or directly modify `src/main/resources/application.properties` (make sure to replace the placeholder API keys with your actual Razorpay, Cloudinary, and Gmail credentials).

Run the Spring Boot application using Maven:
```bash
./mvnw spring-boot:run
```
*(Flyway will automatically create the necessary database tables on the first run!)*

### 3. Frontend Setup
Open a new terminal and navigate to the `frontend` directory:
```bash
cd frontend
npm install
npm run dev
```
The frontend will start running at `http://localhost:5173`.

## 👨‍💻 Default Admin Credentials
When the backend starts up for the first time, it automatically creates a default admin account so you can access the dashboard:
- **Username / Email:** `pgkart_admin` / `pgkart_admin@pgkart.in`
- **Password:** `PGKart@Admin2024!`

*(Note: Please change these credentials if deploying to production!)*

## 🤝 Contributing
We love contributions! If you'd like to improve PGKart, whether it's squashing a bug, improving the UI, or adding a new feature, feel free to fork the repository, create a new branch, and submit a Pull Request.

---
*Built with ❤️ for students.*
