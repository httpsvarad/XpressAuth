import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './db/connectDB.js';
import authRoutes from './routes/auth.route.js';
// import path from 'path';
// import { fileURLToPath } from 'url';

const app = express();
dotenv.config();

// __dirname replacement in ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/user/auth', authRoutes);

// app.use(express.static(path.resolve(__dirname, "../frontend/dist")));

// app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
// });

app.get('/', (req, res)=>{
    res.send('Server Is Running')
})

app.listen(3000, () => {
    connectDB();
    console.log("Server is running on port 3000");
});
