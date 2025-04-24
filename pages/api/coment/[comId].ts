import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { authenticateUser } from '@/backedLogic/authenticateUser';
// import { isAssigned } from '@/backedLogic/isAssigned';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
){
    if(req.method!="DELETE") return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    
    const reqUser = await authenticateUser(req, res);
    if (!reqUser) return;

    const { comId } = req.query;
    if (typeof comId !== "string") {
        return res.status(400).json({ message: "Invalid com ID" });
    }

    const comment = await prisma.comment.findFirst({
        where:{
            id:comId
        }
    })

    if(!comment) return res.status(400).json({
        message:"Comment does not exists"
    })

    // const is = await isAssigned(req, res, reqUser, projectId, "delete this comment");
    // if(!is) return;

    if(comment.madeBy != reqUser.id) return res.status(403).json({
        message:"User can not delete comment"
    })
    try{
        await prisma.comment.delete({
            where:{
                id:comId
            }
        })
    }catch(e){
        return res.status(500).json(`Internal Server Error, ${e}`)
    }

    return res.status(200).json({
        message:"Comment deleted succesfully"
    })
}