import express from "express";
import userRoutes from "./routes/userRoutes.js";
import { notFound, errorHandler, statusHandler} from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import path from "path";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB();
const app = express();

// app.use(express.static(__dirname + '../public'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api/users', userRoutes);

app.get('/' ,(req,res)=>{
    res.send("Server is ready");
});

// app.set('view engine', 'ejs');


// app.set('view engine', 'jade');


app.use(notFound);
app.use(errorHandler);
// app.use(statusHandler);

app.listen(PORT, ()=>{ console.log(`Server is running in ${PORT}`)});