import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
){
  if(req.method == "POST"){ // l
    const { username, password } = req.body;
    const user = await prisma.user.findFirst({
      where:{
        username:username
      }
    })
    
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Set token in HTTP-only cookie
    res.setHeader("Set-Cookie", serialize("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600,
      path: "/",
    }));

    return res.status(200).json({ message: "Login successful" });
  }
  else if(req.method == "PUT"){ // r
    const { username, password, secPassword} = req.body;
    const user = await prisma.user.findFirst({
      where:{
        username:username
      },
      select:{
        id:true
      }
    })

    if(user){
      return res.status(409).json({message:"Username is already taken"})
    }

    if(password != secPassword){
      return res.status(400).json({message:"Passwords are not matching"})
    }
    
    const newUser = await prisma.user.create({
      data:{
        username:username,
        password:bcrypt.hashSync(password, 10),
        imgBitmap:"Comming Soon..."
      }
    })

    const token = jwt.sign({ id: newUser.id, username: username }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Set token in HTTP-only cookie
    res.setHeader("Set-Cookie", serialize("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600,
      path: "/",
    }));

    return res.status(201).json({message:"User created", id:newUser.id})
  }
  return res.status(405).json({ message: "Method Not Allowed" });
}