require('dotenv').config({ path: '.env.local' });

import express, { Request, Response } from "express";

import loginRouter from './routes/login';
import signupRouter from './routes/signup';
import connectDB from "./middleware/connectdb";

const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 3001

app.use(cors());

app.use('/signup', connectDB, signupRouter);
app.use('/login', connectDB, loginRouter);

app.get('/status', (req: Request, res: Response) => {
   res.send("auth service running");
})

app.listen(PORT, () => {
   console.log(`rce-auth service running on port ${PORT}`);
})