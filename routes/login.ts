import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import bcrypt from 'bcryptjs';

require('dotenv').config({ path: '.env.local' });

const jsonwebtoken = require('jsonwebtoken');

import profile from "../models/profile";

const router = express.Router();
const jsonParser = bodyParser.json();

function generateRandomString(length: number) {
   const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
   let result = '';

   for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
   }

   return result;
}

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
         const sessionKey = generateRandomString(15);

         await profile.findByIdAndUpdate(dbProfiles._id, {
            sessionKey: sessionKey
         })

         let token = jsonwebtoken.sign({ 
            email: email, 
            name: dbProfiles.name,
            sessionKey: sessionKey
         }, process.env.JWT_KEY);

         return res.status(200).json({ token: token })
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