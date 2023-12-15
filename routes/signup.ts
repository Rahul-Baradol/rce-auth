import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import crypto from 'crypto'
import profile from "../models/profile";

const router = express.Router();
const jsonParser = bodyParser.json();

router.post('/', jsonParser, async (req: Request, res: Response) => {
   const name = req.body.name;
   const email = req.body.email;
   const pass = req.body.pass;

   const dbProfiles = await profile.findOne({
      email: email
   })

   if (dbProfiles) {
      return res.status(200).json({
         status: "exist"
      })
   }

   let cipher = crypto.createCipheriv(
      'aes-256-cbc', Buffer.alloc(32, 0), Buffer.alloc(16, 0));

   let encrypted = cipher.update(pass);
   encrypted = Buffer.concat([encrypted, cipher.final()]);

   let newProfile = new profile({
      name: name,
      email: email,
      pass: encrypted.toString('hex')
   })
   newProfile.save();

   return res.json({
      status: "created"
   })
})

export default router