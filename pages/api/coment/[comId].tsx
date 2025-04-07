import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { authenticateUser } from '../../../backedLogic/authenticateUser';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
){
    if(req.method!="DELETE") return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    const reqUser = authenticateUser(req, res);
    if (!reqUser) return;


}