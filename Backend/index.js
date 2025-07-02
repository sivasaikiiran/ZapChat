import express from "express"
import { config } from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser";
config();
import dbConnect from "./config/dbConnect.js";
import AuthRoute from "./routes/AuthRoute.js"
import ContactRoute from "./routes/ContactRoute.js"
import ChatRoute from "./routes/ChatRoute.js"
import fileUpload from "express-fileupload"
import cloudinary from "cloudinary"
import { createServer } from "http"
import setupSocket from "./config/socket.js";

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 4000;


// middlewares
app.use(cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
}));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


// routes
app.use('/server/auth', AuthRoute);
app.use('/server/contact', ContactRoute);
app.use('/server/chat', ChatRoute)


// server
dbConnect().then(() => {
    server.listen(PORT, (err) => {
        if (err) throw err;
        console.log(`Server running at PORT no : ${PORT}`);
        setupSocket(server);
    })
}).catch((err) => {
    console.log("Could Not start server!");
})


// custom error middleware
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error"

    return res.status(status).json({
        success: false,
        message,
        status
    })
})