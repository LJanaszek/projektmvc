import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { authenticateUser } from '../../../backedLogic/authenticateUser';
import { isAssigned } from '../../../backedLogic/isAssigned';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
){
    if (!['DELETE', 'PATCH', 'GET'].includes(req.method)) return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    
    const reqUser = authenticateUser(req, res);
    if (!reqUser) return;

    let {projectId} = req.query;
    if (typeof projectId !== "string") {
        return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await prisma.project.findFirst({
        where:{
            id:projectId
        }
    })

    if(!project) return res.status(400).json({
        message:"Project does not exists"
    })

    const is = await isAssigned(req, res, reqUser, projectId, "make changes to this project");
    if(!is) return;
    
    if(req.method=="GET"){
        const tasks = await prisma.task.findMany({
            where:{
                projectId:projectId
            }
        })

        return res.status(200).json({tasks:tasks})
    }
    else if(req.method=="DELETE"){
        try{
            await prisma.project.delete({
                where:{
                    id:projectId
                }
            })

            return res.status(200).json({ message: "Project deleted successfully" });
        }catch(e){
            return res.status(500).json({message:"Internal server error"})
        }

    }
    else if(req.method=="PATCH"){
        const {name, description} = req.body;
        const updateData: any = {};

        if (name) updateData.name = name;
        if (description != null) updateData.description = description;

        try{
            await prisma.project.update({
                where:{
                    id:projectId
                },
                data:updateData
            })

            return res.status(200).json({ message: 'Project updated successfully' });
        }catch(e){
            return res.status(500).json({message:"Internal server error"})
        }
    }
}