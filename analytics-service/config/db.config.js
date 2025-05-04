import mongoose from "mongoose";
import { MONGO_URI } from "../config/env.js";

export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(MONGO_URI);
        console.log(`MongoDB Connected: ${connection.connection.host}`);
    } catch (error) {
        console.log(error);
    }
}