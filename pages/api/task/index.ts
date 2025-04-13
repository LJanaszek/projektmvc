import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { authenticateUser } from '@/backedLogic/authenticateUser';
import { isAssigned } from '@/backedLogic/isAssigned';


const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
){
    if(req.method!="POST") return res.status(405).json({ message: `Method ${req.method} Not Allowed` });

    const reqUser = authenticateUser(req, res);
    if (!reqUser) return;

    const { label, projectId, status } = req.body

    if( typeof projectId!=="string" || typeof label!== "string" || typeof status!=="string"){
        return res.status(400).json({ 
            message:"Missing/Invalid argument/s in request"
        })
    }

    const is = await isAssigned(req, res, reqUser, projectId, "create task in this project");
    if(!is) return;

    const task = await prisma.task.create({
        data:{
            label:label,
            status:status,
            projectId:projectId
        }
    })

    return res.status(201).json({ message:"Task created successfully", task})
}