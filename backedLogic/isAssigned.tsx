import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const isAssigned = async (req,res, reqUser, projectId, msg)=>{
    const isAssigned = await prisma.assignedUsers.findFirst({
        where:{
            userId:reqUser.id,
            projectId:projectId
        }
    })

    if(!isAssigned) return res.status(403).json({
        message:`User not authorized to ${msg}`
    })

    return isAssigned
}