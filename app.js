require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const fileUpload = require("express-fileupload");
const port = 5000;

const path = require("path");

app.use(cors());
// const corsOptions = {
//   origin: "https://designdwell-final.onrender.com", // Replace with your frontend's URL
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   credentials: true, // Enable credentials (if needed)
// };

// app.use(cors(corsOptions));
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const connectDB = require("./db/connect");

const authRouter = require("./routes/Auth");
const designerRouter = require("./routes/DesignerAuth");
const sampleRouter = require("./routes/Sample");
const BeforeAfter = require("./routes/BeforeAfter");

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use("/", authRouter);
app.use("/designer/", designerRouter);
app.use("/work/", sampleRouter, BeforeAfter);

app.use(express.static(path.join(__dirname, "./client/build")));

// Handle all other routes by serving the index.html
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log("error in connection");
    console.log(error);
  }
};

start();
