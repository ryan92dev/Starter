// ENV files
require("dotenv").config();

// Imports
const http = require("http");
const path = require("path");

// Middlewares
const cors = require("cors");
const corsOptions = require("./config/cors/corsOptions");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

// Database
const connectDB = require("./config/connectDB");
connectDB();

// Error Handling
require("express-async-errors");
const errorHandler = require("./middleware/errorHandler");

// Express App
const express = require("express");
const app = express();

// Middlewares Setup
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Base Routes
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/", require("./routes/root"));

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));

// API / PAGE NOT FOUND
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
