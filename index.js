const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");

//FILE
const multer = require("multer");
const path = require("path");

dotenv.config();
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images")));

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    // useFindAndModify:true
  })
  .then(console.log("DB CONNECTED"))
  .catch((err) => console.log(err));

//FILE UPLOADER
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been upload");
});

//route AUTH
app.use("/api/auth", authRoute);

//route USER
app.use("/api/users", userRoute);

//route POST
app.use("/api/posts", postRoute);

//route CATEGORY
app.use("/api/categories", categoryRoute);

app.listen("5000", () => {
  console.log("Backend is  running");
});
