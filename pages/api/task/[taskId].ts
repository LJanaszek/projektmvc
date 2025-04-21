import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { authenticateUser } from '../../../backedLogic/authenticateUser';
import { isAssigned } from '@/backedLogic/isAssigned';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
){
    if (!['DELETE', 'PATCH', 'GET'].includes(req.method)) return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    
    const reqUser = authenticateUser(req, res);
    if (!reqUser) return;

    // const taskId = req.query

    const { taskId } = req.query;
    if (typeof taskId !== "string") {
        return res.status(400).json({ message: "Invalid or missing task ID" });
    }

    const task = await prisma.task.findFirst({
        where:{
            id:taskId
        },
        include:{
            comments:true
        }
    })

    const is = await isAssigned(req, res, reqUser, task.projectId, "User not authorized to do that")
    if(!is) return

    if(req.method=="GET"){ // get comms
        return res.status(200).json(task)
    }
    else if(req.method=="DELETE"){
        await prisma.task.delete({
            where:{
                id:String(taskId)
            }
        })
        return res.status(200).json({message: "OK"})
    }
    else if(req.method=="PATCH"){
        const { label, status, assignedTo, descryption } = req.body;

        const updateData: any = {};

        if (typeof label === "string") updateData.label = label;
        if (typeof status === "string") updateData.status = status;
        if (typeof assignedTo === "string") updateData.assignedTo = assignedTo;
        if (typeof descryption === "string") updateData.descryption = descryption

        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: updateData,
        });

        return res.status(200).json({ message: "Task updated", task: updatedTask });
    }
}