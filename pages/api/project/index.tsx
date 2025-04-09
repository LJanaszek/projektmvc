import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { authenticateUser } from '../../../backedLogic/authenticateUser';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
){
    if (!['POST', 'GET'].includes(req.method)) return res.status(405).json({ message: `Method ${req.method} Not Allowed` });

    const reqUser = authenticateUser(req, res);
    if (!reqUser) return;
    
    if(req.method=="GET"){
        const projects = await prisma.assignedUsers.findMany({
            where:{
                userId:reqUser.id
            },
            include:{
                project:true
            }
        })

        const userProjects = projects.map(p => p.project);
        return res.status(200).json(userProjects);     
    }
    if(req.method=="POST"){
        const { descryption, name } = req.body;
        if(!name) return res.status(400).json({
            message:"No name given"
        });

        const project = await prisma.project.findFirst({
            where:{
                name:name
            }
        })

        if(project) return res.status(409).json({
            message:"Project name already in use"
        });

        try{
            const newProject = await prisma.project.create({
                data:{
                    name:name,
                    descryption:descryption || ""
                }
            })

            await prisma.assignedUsers.create({
                data:{
                    userId:reqUser.id,
                    projectId:newProject.id,
                }
            })

            return res.status(201).json({project:newProject});
        }
        catch(e){
            return res.status(500).json({message:"Error with serv"});
        }
    }
}