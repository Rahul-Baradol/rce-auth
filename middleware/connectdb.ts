import mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";
require('dotenv').config({ path: ".env.local" })

export default async function connectDB(req: Request, res: Response, next: NextFunction) {
    if (mongoose.connections[0].readyState) {
        next();
        return;
    }
    
    await mongoose.connect(process.env.MONGODB_URI ?? "");
    next();
}