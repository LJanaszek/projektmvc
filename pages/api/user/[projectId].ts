import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { authenticateUser } from '../../../backedLogic/authenticateUser';
import { isAssigned } from '../../../backedLogic/isAssigned';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
){
    if (!['GET'].includes(req.method)) return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    
    const reqUser = await authenticateUser(req, res);
    if (!reqUser) return;

    const {projectId} = req.query;
    if (typeof projectId !== "string") {
        return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await prisma.project.findFirst({
        where:{
            id:projectId
        }
    })

    if(!project) return res.status(404).json({
        message:"Project does not exists"
    })

    const is = await isAssigned(req, res, reqUser, projectId, "make changes to this project");
    if(!is) return;
    
    if(req.method=="GET"){
        const users= await prisma.assignedUsers.findMany({
            where:{
                projectId:projectId
            },
            include:{
                user:true
            }
        })

        const asUsers = users.map(u => u.user);
        return res.status(200).json(asUsers)     
    }
}