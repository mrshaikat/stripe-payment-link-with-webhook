const express = require("express");
const cors = require("cors");
const env = require("dotenv");
const stripeRouter = require("./routes/stripe");
const connectDb = require("./config/db");

env.config();

const port = process.env.PORT || 4000;
const app = express();

app.use((req, res, next) => {
  if (req.originalUrl === "/api/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use(cors());

app.use("/api", stripeRouter);

connectDb();

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
