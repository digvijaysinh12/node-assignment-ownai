import { DataSource } from "typeorm"; //This is used for database connection
import { User } from "./entities/User.js";
import dotenv from "dotenv";

//This is for use env file variables
dotenv.config(); 

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,// When App is started then automatically table created based on entity
  logging: false,
  entities: [User],
});

export const initializeDB = async () => {
  try {
    console.log(process.env.DB_PASSWORD)
    await AppDataSource.initialize();
    console.log("Database connected successfully!");
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
};
