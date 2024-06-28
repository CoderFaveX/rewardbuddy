const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config");
const path = require("path");
const webhook = require("./bot");
const biweeklyRewards = require("./commands/biWeeklyRewards");

const app = express();
const port = process.env.PORT || 80; // Adjust port number as necessary

// Connect to MongoDB
connectDB();

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Webhook route
app.use("/api", webhook);

// Endpoint to handle biweekly rewards distribution
app.post("/api/distribute-rewards", async (req, res) => {
  try {
    await biweeklyRewards();
    res.status(200).send("Biweekly rewards distributed successfully.");
  } catch (error) {
    console.error("Error distributing rewards:", error);
    res.status(500).send("Error distributing rewards.");
  }
});

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
