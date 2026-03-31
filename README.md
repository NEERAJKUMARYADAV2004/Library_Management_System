# LMS Pro - Library Management System

LMS Pro is a high-fidelity, professional Library Management System built on the **MERN** stack (MongoDB, Express, React, Node.js). It features a premium glassmorphic dark-mode interface and a strict administrative approval workflow for all library transactions.

---

## 🚀 Key Features

### 🛡️ Administrative Control
- **Full Inventory Management**: Add, update, and remove Books and Movies with unique serial number tracking.
- **Membership Oversight**: Complete lifecycle management of library members with Aadhar-based identity verification.
- **Transaction Gatekeeper**: A secure request-approval system where Admin must authorize all item issues and returns.
- **Operations Reports**: High-precision data tables including a 9-column Membership report and a 6-column Overdue report.

### 👤 Member Experience
- **Personalized Dashboard**: View active issues, pending requests, and transaction history.
- **Search Matrix**: High-speed filtering for books and movies across the entire inventory.
- **Secure Requests**: Submit issue and return requests directly from the dashboard.
- **Fine Settlement**: Built-in logic to track and settle overdue fines before item return completion.

### 🔒 Strict Validation & Security
- **Data Integrity**: Enforced **10-digit** phone number and **12-digit** Aadhar card numeric locks.
- **Clean Architecture**: Standardized "Member" terminology across the entire codebase (DB, Auth, and UI).
- **Silent Operations**: Production-ready code with no console logs or debug boilerplate.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Lucide Icons, Vanilla CSS (Glassmorphism).
- **Backend**: Node.js, Express 5.
- **Database**: MongoDB (Mongoose 9).
- **Verification**: Strict regular expression and schema-level validation.

---

## 🏁 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v25+ recommended)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or local MongoDB instance.

### 1. Backend Setup
```bash
cd Backend
npm install
```
Create a `.env` file in the `Backend` directory:
```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```
Seed the database with default administrative and member accounts:
```bash
node seed.js
```
Start the server:
```bash
node index.js
```

### 2. Frontend Setup
```bash
cd Front-end
npm install
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## 🔑 Default Credentials (for testing)

| Role | Username (ID/Aadhar) | Password |
| :--- | :--- | :--- |
| **Admin** | `123123123123` | `adm` |
| **Member** | `123456789012` | `user` |

---

## 📂 Project Structure

```text
├── Backend/
│   ├── controllers/   # Business logic (Auth, Transactions, Reports)
│   ├── models/        # Database schemas (Book, Member, Transaction)
│   ├── routes/        # API endpoints
│   ├── index.js       # Entry point
│   └── seed.js        # Initial data setup
└── Front-end/
    ├── src/
    │   ├── components/ # Shared UI (Sidebar, Modal)
    │   ├── context/    # Auth and Modal state providers
    │   ├── pages/      # Views (Maintenance, Reports, Dashboards)
    │   └── utils/      # Validation and helper logic
    └── index.html      # App shell
```

---

*Developed for high-fidelity library operations with logic accuracy and zero technical debt.*
