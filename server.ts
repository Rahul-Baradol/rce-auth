require('dotenv').config({ path: '.env.local' });

import express, { Request, Response } from "express";

import loginRouter from './routes/login';
import signupRouter from './routes/signup';
import connectDB from "./middleware/connectdb";

const cors = require('cors');
const app = express();

app.use(cors());

app.use('/signup', connectDB, signupRouter);
app.use('/login', connectDB, loginRouter);

app.get('/', (req: Request, res: Response) => {
   res.send("auth service running");
})

app.listen(process.env.PORT, () => {
   console.log(`rec-auth service running on port ${process.env.PORT}`);
})