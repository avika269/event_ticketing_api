import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = await mysql.createConnection({
    host: process.env.DB_localhost,
    user: process.env.DB_root,
    password: process.env.DB_12345678,
    database: process.env.DB_event_ticketing,
    port: process.env.DB_3306
  });

console.log("MySQL connected successfully");

export default db;