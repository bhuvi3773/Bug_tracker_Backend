const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");

const app = express();

require("dotenv").config();

const connectDB = require("./config/db");

app.use(express.json());

const bugRoutes = require("./Routes/bugRoutes");

const testRoutes = require("./Routes/testRoutes");

const userRoutes = require("./Routes/userRoutes");

connectDB();

app.use("/api/test", testRoutes);

app.use("/api/bugs", bugRoutes);

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
