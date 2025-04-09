import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { authenticateUser } from '../../../backedLogic/authenticateUser';
import { isAssigned } from '@/backedLogic/isAssigned';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
){
    if(req.method != "PATCH") return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    
    const reqUser = authenticateUser(req, res);
    if (!reqUser) return;

    const {taskId, projectId, body} = req.body;

    if (!taskId || !projectId || !body) {
        return res.status(400).json({ message: "Missing taskId, projectId or comment body" });
    }

    const is = await isAssigned(req, res, reqUser, projectId, "create comments in this project")
    if(!is) return

    try{
        let come = await prisma.comment.create({
            data:{
                body:body, 
                madeBy:reqUser.id,
                taskId:taskId
            }
        })

        return res.status(201).json({ message:"Comment created successfuly", come })
    }catch(e){
        return res.status(500).json("Internal Server Error")
    }
}