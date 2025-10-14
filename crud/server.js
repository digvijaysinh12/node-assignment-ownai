import express from "express";
import { initializeDB } from "./db.js";

initializeDB();

const app = express();

// Simple route for Testing purpose
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
