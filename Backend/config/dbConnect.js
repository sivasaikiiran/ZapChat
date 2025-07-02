import mongoose from "mongoose";
import { config } from "dotenv";
config();


const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connection with database successful!");
    } catch (error) {
        console.log("Could Not Connect With Database !");
        console.log(error)
        process.exit(1);
    }
}

export default dbConnect;