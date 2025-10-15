import express from "express";
import { initializeDB } from "./db.js";
import userRoute from "./routes/userRoute.js"
import cookieParser from "cookie-parser";


// this is for database connection initialize
initializeDB();


const app = express();

// This is Middleware to parse incoming JOSN data
app.use(express.json());

// THis is Middleware for to parse cookies
app.use(cookieParser());

// Simple route for Testing purpose
app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.use('/user',userRoute)

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
