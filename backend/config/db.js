import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const uri = process.env.MONGO_URL;

const connectToDatabase = () => {
    mongoose.connect(uri)
    .then(() => {
        console.log('Database is connected');
    })
    .catch((e) => {
        console.error('Database connection error:', e);
    });
};

export default connectToDatabase;
