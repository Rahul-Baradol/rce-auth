import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import bcrypt from 'bcryptjs';

require('dotenv').config({ path: '.env.local' });

const jsonwebtoken = require('jsonwebtoken');

import profile from "../models/profile";

const router = express.Router();
const jsonParser = bodyParser.json();

router.post('/', jsonParser, async (req: Request, res: Response) => {
   try {
      const email = req.body.email;
      const pass = req.body.pass;

      const dbProfiles = await profile.findOne({
         email: email
      })

      if (!dbProfiles) {
         return res.status(403).json({
            status: "invalid"
         })
      }

      const permit = bcrypt.compareSync(pass, dbProfiles.pass);

      if (permit) {
         let date = new Date();
         let utcTime = date.toISOString();
         
         await profile.findByIdAndUpdate(dbProfiles._id, {
            loginTime: utcTime
         })

         let token = jsonwebtoken.sign({ 
            email: email, 
            name: dbProfiles.name,
            loginTime: utcTime
         }, process.env.JWT_KEY);

         return res.status(200).json({ 
            token: token,
            email: email,
            user: dbProfiles.name
         })
      }

      return res.status(403).json({
         status: "invalid"
      })
   } catch {
      res.status(500).json({
         status: "error"
      });
   }
})

export default router;