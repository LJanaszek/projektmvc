// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if(req.method === "DELETE") {
    const {unodostres} = req.body;

    res.status(200).json({ message: "User created successfully",deletedData : unodostres,});
  }
  if (req.method === 'POST') {
    // Handle POST request
    try {
      const newUser = await prisma.user.create({
        data: {
          username: "pomidor",
          password: bcrypt.hashSync("123", 10),
          imgBitmap: "dsadsa",
        },
      });

      return res.status(200).json({ message: "User created successfully", user: newUser });
    } catch (error) {
      return res.status(500).json({ message: "Error creating user", error: error.message });
    }
  // } else if (req.method === 'GET') {
  //   // Handle GET request
  //   try {
  //     const users = await prisma.user.findMany();
  //     return res.status(200).json(users);
  //   } catch (error) {
  //     return res.status(500).json({ message: "Error fetching users", error: error.message });
  //   }
  
  } 
  else if(req.method === "GET"){
    let password = "1234"
    password = await hashPassword(password);
    return res.status(200).json({ message: password });
  }
  else {
    // Handle unsupported HTTP methods
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}

const hashPassword = async (plainPassword) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
};

// faktura pomidora 