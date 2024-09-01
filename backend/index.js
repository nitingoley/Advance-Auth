import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import connectToDatabase from './config/db.js';
import bodyParser from  "body-parser";
import router from "./Routes/userRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";

// db connection  
connectToDatabase();
// port connection 
const Port  = process.env.PORT || 9000


app.use(cors({ origin: "https://advance-auth-frontend.vercel.app",
    methods: ["POST" , "GET"],
    credentials: true }));

// middleware setup 
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());

// route  
app.use("/api/v3" , router);


app.listen(Port, ()=>{
    console.log(`Your server running on the port ${Port}`);
    
})
