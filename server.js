const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");

require("dotenv").config();
require("./middlewares/auth");

const authController = require("./controllers/authController");
const userController = require("./controllers/usersController");
const productController = require("./controllers/productsController");
const categoryController = require("./controllers/categoryController");

const upload = multer();
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array());

const port = 3000;

app.use("/auth", authController);
app.use("/users", userController);
app.use("/category", categoryController);
app.use("/product", productController);

app.get("/", async (req, res) => {
  res.send({
    message: "server is running",
    version: 1.2,
    process: process.env?.mongo_url ?? null,
  });
});


app.listen(port, () => {
  console.log(`Server running at localhost:${port}`);
});
