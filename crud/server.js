import express from "express";
import { initializeDB } from "./db.js";
import userRoute from "./routes/userRoute.js"

initializeDB();

const app = express();

app.use(express.json());

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
