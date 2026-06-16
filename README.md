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

*Built with ❤️ for students.*
