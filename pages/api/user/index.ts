import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { authenticateUser } from '@/backedLogic/authenticateUser';
import { isAssigned } from '@/backedLogic/isAssigned';


const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
){
    if (!['POST', 'GET','DELETE'].includes(req.method)) return res.status(405).json({ message: `Method ${req.method} Not Allowed` });

    const reqUser = await authenticateUser(req, res);
    if (!reqUser) return;

    if(req.method==="GET"){
        const users = await prisma.user.findMany()
        return res.status(200).json({users})
    }
    
    const { projectId, userId } = req.body

    const is = await isAssigned(req, res, reqUser, projectId, "assign users in this project");
    if(!is) return;

    if( typeof projectId!=="string" || typeof userId!== "string"){
        return res.status(400).json({ 
            message:"Missing/Invalid argument/s in request"
        })
    }
    
    if(req.method==="POST"){
        await prisma.assignedUsers.create({
            data:{
                userId:userId,
                projectId:projectId
            }
        })

        return res.status(201).json({ message:"Project assigned successfully"})
    }
    else if(req.method==="DELETE"){
        await prisma.assignedUsers.deleteMany({
            where:{
                userId:userId,
                projectId:projectId
            }
        })

        return res.status(200).json({message:"User deleted form project"})
    }    
}