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

// Serve static files from the React app's build folder
app.use(express.static(path.join(__dirname, "..", "build")));

// Serve the React app for any route not handled by the API
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

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
