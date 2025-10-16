# User Management API

A simple **Node.js + Express + TypeORM + MySQL** project for user registration, login, searching users, and fetching user details with **role-based access control** (Admin/Staff).  

---

## Features

- **User Registration**  
  - Register new users with `name`, `email`, `password`, `role`, `phone`, `city`, `country`.
  - Validates required fields.
  - Prevents duplicate email registration.
  - Passwords are hashed with **bcrypt** for security.

- **User Login**  
  - Users can log in with email and password.
  - Generates a **JWT token** for authentication.
  - Token is stored in an **httpOnly cookie** to prevent JS access.

- **Search Users (Admin only)**  
  - Search users by `name` or `email`.
  - Filter users by `country`.
  - Only Admin users can access this route.

- **User Details**  
  - Staff → can view only their own details.
  - Admin → can view details of any user by ID.
  - JWT authentication required.

---

## Technologies Used

- Node.js
- Express.js
- MySQL
- TypeORM
- bcrypt
- JSON Web Token (JWT)
- dotenv
- cookie-parser

---

## Setup

1. **Clone the repository**

```bash
git clone https://github.com/digvijaysinh12/node-assignment-ownai.git
cd node-assignment-ownai
cd crud

Install dependencies

npm install


Create a .env file in the root folder with the following:

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=yourdatabasename
JWT_SECRET=yourjwtsecret
PORT=5000


Run the server

npm start


Server will run on http://localhost:5000.

API Routes
1. Register User

POST /user/register

Request Body:

{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "123456",
  "role": "Staff",
  "phone": "9999999999",
  "city": "Ahmedabad",
  "country": "India"
}


Response:

{
  "success": true,
  "message": "User registered successfully"
}

2. Login User

POST /user/login

Request Body:

{
  "email": "alice@example.com",
  "password": "123456"
}


Response:

{
  "success": true,
  "message": "User login Successfully"
}

3. Search Users (Admin Only)

GET /user/list
Headers: Authorization: Bearer <JWT_TOKEN>

Request Body (optional search/filter):

{
  "search": "Alice",
  "country": "India"
}


Response:

{
  "success": true,
  "message": "Users fetched successfully",
  "users": [
    {
      "id": 1,
      "name": "Alice",
      "email": "alice@example.com",
      "role": "Staff",
      "country": "India"
    }
  ]
}

4. Get User Details

GET /user/:id
Headers: Authorization: Bearer <JWT_TOKEN>

Staff → can only view their own details

Admin → can view any user's details

Response:

{
  "success": true,
  "userDetails": {
    "id": 1,
    "name": "Alice",
    "email": "alice@example.com",
    "role": "Staff",
    "country": "India"
  }
}

Middleware
authMiddleware → Checks JWT token from cookie and adds req.user to request.

Database
TypeORM used for MySQL connection.
Auto-generates tables based on User entity.

User Table Columns:
id (Primary, Auto Increment)
name
email (Unique)
password
role (default: Staff)
phone
city
country
created_at
updated_at
