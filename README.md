# Library Management System (MERN Stack)

A comprehensive and fully functional Library Management System built using the MERN stack. This application allows administrators to seamlessly manage books, students, and library transactions.

## 🚀 Features (Modules)
1. **Admin Login:** Secure authentication system for library administrators.
2. **Dashboard:** Real-time overview of total books, registered students, active issued books, and total fines collected.
3. **Book Management:** Complete CRUD functionality to Add, Update, View, and Delete book records.
4. **Student Management:** Keep track of student details (ID, Name, Email, Course, Year) with full CRUD operations.
5. **Issue & Return Books:** Dedicated tracking system to issue books to students and process returns with due date monitoring.
6. **Reports:** Generate and view transaction logs and issue reports.

## 🛠 Tech Stack
* **Frontend:** React.js (Vite), Tailwind CSS, React Router DOM, Axios, Lucide React (Icons)
* **Backend:** Node.js, Express.js, CORS
* **Database:** MongoDB (Atlas Cloud)

## 📁 Project Structure
The project is strictly divided into two distinct directories:
* `/frontend` - Contains the Vite React client application.
* `/backend` - Contains the Express.js server, Mongoose models, and API routes.

## 💻 Local Setup Instructions

### Prerequisites
* Node.js installed on your local machine.
* A valid MongoDB URI (Local or Atlas).

### 1. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
