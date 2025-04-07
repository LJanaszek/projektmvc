import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { authenticateUser } from '../../../backedLogic/authenticateUser';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
){
    if (!['DELETE', 'PATCH', 'GET'].includes(req.method)) return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    
    const reqUser = authenticateUser(req, res);
    if (!reqUser) return;

    if(req.method=="GET"){ // get comms

    }
    else if(req.method=="DELETE"){

    }
    else if(req.method=="PATCH"){

    }
}