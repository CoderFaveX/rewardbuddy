const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config");
const webhook = require("./bot");

const app = express();
const port = process.env.PORT || 80; // Adjust port number as necessary

// Connect to MongoDB
connectDB();

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Webhook route
app.use("/api", webhook);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).send("404: Not Found");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
