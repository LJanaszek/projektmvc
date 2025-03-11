// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST method to create a new user
export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Handle POST request
    try {
      const newUser = await prisma.user.create({
        data: {
          username: "pomidor",
          password: "securepassword",
          imgBitmap: "dsadsa",
        },
      });

      return res.status(200).json({ message: "User created successfully", user: newUser });
    } catch (error) {
      return res.status(500).json({ message: "Error creating user", error: error.message });
    }
  } else if (req.method === 'GET') {
    // Handle GET request
    try {
      const users = await prisma.user.findMany();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching users", error: error.message });
    }
  } else {
    // Handle unsupported HTTP methods
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}


// faktura pomidora