// Main file for the application. It sets up the express app and connects to the database.

import "dotenv/config";
import mongoose from "mongoose";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import rateLimit from "./helpers/rateLimit.js";
import usersRoutes from "./routes/usersRoutes.js";
import ticketsRoutes from "./routes/ticketsRoutes.js";
import error from "./middlewares/error.js";

// Create the express app
const app = express();

const DB_URL = (process.env.NODE_ENV === "test" 
  ? process.env.DB_URL_TEST : process.env.DB_URL);

// Connect to the database
mongoose.connect(DB_URL)
  .then(() => console.log(`Connected to ${DB_URL}`))
  .catch(err => console.error('Failed to connect to MongoDB',err));

// Middlewares
app.use(morgan("dev")); // Logs HTTP requests
app.use(helmet()); // Sets security headers
app.use(cors()); // Allows cross-origin requests
if (process.env.NODE_ENV === "prod") {
  app.use(compression()); // Compresses response bodies
  app.use(rateLimit); // Rate limits requests
}
app.use(express.json()); // Parses JSON bodies

// Routes
app.get("/", (req, res) => { // Root route
  res.status(200).send("Hello World!");
});

app.use("/api/users", usersRoutes); // Mount the users routes
app.use("/api/tickets",ticketsRoutes); // Mount the tickets routes

// Error middleware
app.use(error); // Handles errors

export default app;