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
};

export async function getFriendRequests(req: Request, res: Response) {
    try {
        const user = req.user;

        // Find friend requests sent to THIS user
        const requests = await prisma.friendRequest.findMany({
            where: {
                receiverId: user.id,
                status: "pending"
            },
            select: {
                id: true,
                createdAt: true,
                sender: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        bio: true,
                        friendCode: true,
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return res.status(200).json({ ok: true, requests });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Failed to get friend requests"
        });
    }
};

export async function rejectFriendRequest(req: Request, res: Response) {
    try {
        const user = req.user;
        const { id } = req.params as { id: string };

        const request = await prisma.friendRequest.findUnique({
            where: { id }
        });

        if (!request) {
            return res.status(404).json({
                ok: false,
                message: "Request not found"
            });
        }

        if (request.receiverId !== user.id) {
            return res.status(403).json({
                ok: false,
                message: "Not allowed"
            });
        }

        await prisma.friendRequest.delete({
            where: { id }
        });

        return res.json({
            ok: true,
            message: "Friend request rejected"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Failed to rejecr friend request"
        });
    }
};

export async function acceptFriendRequest(req: Request, res: Response) {
    try {
        const user = req.user;
        const { id } = req.params as { id: string };


        const request = await prisma.friendRequest.findUnique({
            where: { id: id }
        });


        if (!request) {
            return res.status(404).json({ ok: false, message: "Friend request does not exist" });
        };


        if (request.receiverId !== user.id) {
            return res.status(403).json({
                ok: false,
                message: "Not allowed"
            });
        };


        await prisma.$transaction(async (tx) => {

            // create friendship
            await tx.friendship.create({
                data: {
                    user1Id: request.senderId,
                    user2Id: request.receiverId
                }
            });

            // update request
            await tx.friendRequest.update({
                where: { id },
                data: { status: "accepted" }
            });
        });



        return res.json({
            ok: true,
            message: "Friend request accepted"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, message: "Failed to accept friend request" });
    }
};