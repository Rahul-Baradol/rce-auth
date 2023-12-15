import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import crypto from 'crypto'

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

   let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.alloc(32, 0), Buffer.alloc(16, 0));

   let encrypted = cipher.update(pass);
   encrypted = Buffer.concat([encrypted, cipher.final()]);

   if (encrypted.toString('hex') === dbProfiles.pass) {
      let token = jsonwebtoken.sign({ email: email, name: dbProfiles.name }, 'secret', { expiresIn: '1h' });
      return res.status(200).json({ token: token })
   }
   
   return res.status(200).json({
      status: "invalid"
   })
})

export default router