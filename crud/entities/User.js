// entities/User.js
import { EntitySchema } from "typeorm";

export const User = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: { type: Number, primary: true, generated: true },
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    role: { type: String, default: "Staff" },
    phone: { type: String },
    city: { type: String, nullable: true },
    country: { type: String, nullable: true },
    created_at: { type: "timestamp", createDate: true },
    updated_at: { type: "timestamp", updateDate: true },
  },
});
