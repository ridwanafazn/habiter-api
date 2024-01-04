const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const route = require("./route.js");

dotenv.config();

const app = express();

const uri = process.env.MONGODB_URI;
mongoose
  .connect(uri)
  .then(() => {
    console.log("Yeay!! DB Connection Succesfull!");
  })
  .catch((e) => {
    console.log(e.message);
  });

app.use(
  cors({
    origin: ["*"],
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

app.use(express.json());

app.use(route);

process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log("MongoDB connection closed.");
    process.exit(0);
  });
});

const port = process.env.PORT || 5000;
const server = app.listen(port, () =>
  console.log(`Server up and running on port ${port}`)
);
