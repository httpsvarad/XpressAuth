import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://varadmanegopale28:Zf7QflU6a77XLKxI@cluster0.uci4d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
        console.log("Connected to DB");
    } catch (error) {
        console.log("Error connecting MongoDB: ", error.message);
    }
};
