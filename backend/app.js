const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db"); // ✅ import

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ connect DB
connectDB();

app.use(cors());
app.use(express.json());

const testRoutes = require("./routes/testRoutes");

app.use("/api", testRoutes);

app.get("/", (req, res) => {
  res.send("Server working");
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});