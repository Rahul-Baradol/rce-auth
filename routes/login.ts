import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import bcrypt from 'bcryptjs';

require('dotenv').config({ path: '.env.local' });

const jsonwebtoken = require('jsonwebtoken');

import profile from "../models/profile";

const router = express.Router();
const jsonParser = bodyParser.json();

router.post('/', jsonParser, async (req: Request, res: Response) => {
   const email = req.body.email;
   const pass = req.body.pass;

   const dbProfiles = await profile.findOne({
      email: email
   })

   if (!dbProfiles) {
      return res.status(200).json({
         status: "invalid"
      })
   }
   
   const permit = bcrypt.compareSync(pass, dbProfiles.pass);

   if (permit) {
      let token = jsonwebtoken.sign({ email: email, name: dbProfiles.name }, process.env.JWT_KEY);
      return res.status(200).json({ token: token })
   }
   
   return res.status(200).json({
      status: "invalid"
   })
})

export default router;