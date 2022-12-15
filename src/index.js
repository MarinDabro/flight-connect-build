//===> Packages
import express from "express";
import morgan from "morgan";
import cors from "cors";
import multer from "multer";
import mongoose from "mongoose";

//===> API routes
import autocompRoute from "./autocompRoute.js";
import searchRoute from "./searchRoute.js";
import airportRoute from "./airportRoute.js";
import dealsRoute from "./dealsRoute.js";
import activityRoute from "./activityRoute.js";
import googleRoute from './googleRoute.js'
import bookingRoute from './bookingRoute.js'

//===> orders route
import ordersRoute from '../routes/ordersRoute.js'

//===> flights routes
import flightRoute from '../routes/flightsRoute.js'

// ===>  user routes
import userRoute from "../routes/userRoute.js";

// ===> Mongoose Url
import { MONGOOSE_URL } from "./config.js";

// ===> Setting the server
const app = express();
const PORT = process.env.PORT || 1338;

//===> Using the packages
app.use(morgan("dev"));
app.use(express.json());
 app.use(cors({ origin: "*", exposedHeaders: ['token'] })); 

//===> Multer

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let fullPath = "./upload";
    cb(null, fullPath);
  },
  fileName: function (req, file, cb) {
    let fileName = Date.now() + "_" + file.originalname;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

//===> Mongoose connection
/* mongoose.set('strictQuery', true) */
 mongoose.connect(MONGOOSE_URL); 
/* mongoose.connect(
  process.env.URL,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  () => {
    console.log('Connected to MongoDB');
  }
); */

//===> Routes
app.use("/users", upload.single("image"), userRoute);
//===> flights route

app.use('/flights', flightRoute)

//===> orders route

app.use('/orders', ordersRoute);

//===> Applying handler for API

app.use("/", autocompRoute);
app.use("/", searchRoute);
app.use("/", airportRoute);
app.use("/", dealsRoute);
app.use("/", activityRoute);
app.use("/", googleRoute);
app.use("/", bookingRoute);

//===> Static files
app.use(express.static('upload'))

//===> deployment serving front end (client)
app.use(express.static("view/build"));
app.get('/', (req, res) => {
  res.sendFile('./view/build/index.html', {root: '.'})
})

//===> Build 
/* app.get("/", (req, res) => {
  res.sendFile("../react/build/index.html", { root: "." });
});
 */
//===> Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500 ).json({success: false, message: err.message})
})


// ===> listening to the server 

app.listen(PORT, () => {
  console.log("Server is running on port:", PORT);
});
