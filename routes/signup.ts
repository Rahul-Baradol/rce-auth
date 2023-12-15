import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import bcrypt from 'bcryptjs'
import profile from "../models/profile";

require('dotenv').config({ path: '.env.local' });

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

   const hash = bcrypt.hashSync(pass, Number(process.env.ENCRYPTION_SALT));

   let newProfile = new profile({
      name: name,
      email: email,
      pass: hash
   })

   newProfile.save();

   return res.json({
      status: "created"
   })
})

export default router;