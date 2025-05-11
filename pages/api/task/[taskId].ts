import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { authenticateUser } from '../../../backedLogic/authenticateUser';
import { isAssigned } from '@/backedLogic/isAssigned';

const prisma = new PrismaClient();
type UpdateData = {
    label?: string;
    status?: string;
    description?: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (!['DELETE', 'PATCH', 'GET'].includes(req.method)) return res.status(405).json({ message: `Method ${req.method} Not Allowed` });

    const reqUser = await authenticateUser(req, res);
    if (!reqUser) return;

    // const taskId = req.query

    const { taskId } = req.query;
    if (typeof taskId !== "string") {
        return res.status(400).json({ message: "Invalid or missing task ID" });
    }

    const task = await prisma.task.findFirst({
        where: {
            id: taskId
        },
        include: {
            comments: true
        }
    })

    const is = await isAssigned(req, res, reqUser, task.projectId, "User not authorized to do that")
    if (!is) return

    if (req.method == "GET") { // get comms
        return res.status(200).json(task)
    }
    else if (req.method == "DELETE") {
        await prisma.task.delete({
            where: {
                id: String(taskId)
            }
        })
        return res.status(200).json({ message: "OK" })
    }
    else if (req.method == "PATCH") {
        const { label, status, assignedTo, description } = req.body;

        const updateData: UpdateData = {};

        if (typeof label === "string") updateData.label = label;
        if (typeof status === "string") updateData.status = status;
        if (typeof description === "string") updateData.description = description

        const updatedTask1 = await prisma.task.update({
            where: { id: taskId },
            data: updateData,
        });

        if (assignedTo !== " ") {
            await prisma.task.update({
                where: { id: taskId },
                data: {
                    assignedTo: assignedTo
                }
            });
        }

        return res.status(200).json({ message: "Task updated", task: updatedTask1 });
    }
}