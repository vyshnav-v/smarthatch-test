import express from "express";
import dotenv from "dotenv";
import UserRouter from "./Routes/UserRoutes.js";
import connectDB from "./Config/db.js";


const app = express();
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();
app.get("/", function (req, res) {
  res.json({
    name: "Vaishnav",
  });
});
app.use("/api", UserRouter);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
