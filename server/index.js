import 'dotenv/config.js';
import cors from 'cors';
import express from "express";
import connectDB from './connectDB.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

import {authRouter} from './routes/AuthRoutes.js'
import { userRouter } from './routes/UserRoutes.js';
import { blogPostsRouter } from './routes/BlogPostsRoutes.js';

// configurations
const app = express();
const PORT = process.env.PORT || 8000;
//const __filename = fileURLToPath(import.meta.url)
//const __dirname = path.dirname(__filename);

connectDB();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/assets", express.static('./public/assets'));

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/blogPosts", blogPostsRouter);


app.get("/", (req, res) => {
    res.json("Hello Alexis!");
})

app.get("*", (req, res) => {
    res.sendStatus("404");
})

app.listen(PORT, () => {
    console.log(`Server is running on Port: ${PORT}`);
})