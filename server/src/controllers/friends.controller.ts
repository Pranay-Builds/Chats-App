import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";


export async function sendFriendRequest(req: Request, res: Response) {
    try {
        const user = req.user;

        const { friendCode } = req.body;

        if (!friendCode) {
            return res.status(400).json({ ok: false, message: "Friend code not provided" });
        };


        const receiver = await prisma.user.findUnique({
            where: {
                friendCode: friendCode
            },
            select: {
                id: true,
                image: true,
                name: true,
                friendCode: true,
            }
        });




        if (!receiver) {
            return res.status(400).json({ ok: false, message: "Invalid friend code or user not found" });
        };


        const existingRequest = await prisma.friendRequest.findFirst({
            where: {
                OR: [
                    {
                        senderId: user.id,
                        receiverId: receiver.id
                    },
                    {
                        senderId: receiver.id,
                        receiverId: user.id
                    }
                ],
                status: "pending"
            }
        });

        if (existingRequest) {
            return res.status(409).json({
                ok: false,
                message: "Friend request already exists"
            });
        };


        if (receiver.id === user.id) {
            return res.status(422).json({ ok: false, message: "You cannot send friend requests to yourself" });
        };


        const existingFriendship = await prisma.friendship.findFirst({
            where: {
                OR: [
                    { user1Id: user.id, user2Id: receiver.id },
                    { user1Id: receiver.id, user2Id: user.id }
                ]
            }
        });


        if (existingFriendship) {
            return res.status(409).json({
                ok: false,
                message: "You are already friends"
            });
        }


        await prisma.friendRequest.create({
            data: {
                senderId: user.id,
                receiverId: receiver.id,
                status: "pending"
            }
        });

        return res.status(201).json({ ok: true, message: "Friend request sent" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Failed to send friend request"
        });
    }
}