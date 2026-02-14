import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";


// Get all chats
export async function getChats(req: Request, res: Response) {
    try {
        const user = req.user;

        // Get all chats of this user
        const chats = await prisma.conversation.findMany({
            where: {
                members: {
                    some: {
                        user: {
                            id: user.id
                        }
                    }
                }
            },
            select: {
                id: true,
                name: true,
                members: true,
                lastMessage: true,
                lastMessageAt: true
            }
        });


        return res.status(200).json({ ok: true, chats });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, message: "Failed to get chats" });
    }
};

// To create 1:1 Chats
export async function createChat(req: Request, res: Response) {
    try {
        const user = req.user;
        const { friendId, messageContent } = req.body;


        if (!friendId || !messageContent) {
            return res.status(400).json({ ok: false, message: "Friend ID and message content required" });
        };

        const friend = await prisma.friendship.findFirst({
            where: {
                OR: [
                    { user1Id: friendId, user2Id: user.id },
                    { user1Id: user.id, user2Id: friendId }
                ]
            }
        });


        if (!friend) {
            return res.status(404).json({ ok: false, message: "You can only create a chat with your friends" });
        };

        // Find existing chats - IF yes then do not allow
        const existingChat = await prisma.conversationMember.findFirst({
            where: {
                userId: user.id,
                conversation: {
                    isGroup: false,
                    members: {
                        some: {
                            userId: friendId
                        }
                    }
                }
            }
        });


        if (existingChat) {
            return res.status(409).json({ ok: false, message: "Chat already exists" });
        }

        return res.status(201).json({ ok: true })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, message: "Server error, failed to create chat" });
    }
};

// Create Group Chats
export async function createGroupChat(req: Request, res: Response) {
    try {
        const user = req.user;
        const { name, membersId } = req.body;

        // Avoid duplicates by making a Set which automatically removes duplicates
        const uniqueMemberIds = [...new Set([...membersId, user.id])]

        if (!name || !uniqueMemberIds) {
            return res.status(400).json({ ok: false, message: "You must provide group chat name and member Ids" })
        };

        const newGroupChat = await prisma.$transaction(async (tx) => {
            const conversation = await tx.conversation.create({
                data: {
                    name: name,
                    isGroup: true,
                }
            });


            await tx.conversationMember.createMany({
                data: uniqueMemberIds.map(userId => ({
                    conversationId: conversation.id,
                    userId: userId
                }))
            });

            return conversation
        });


        return res.status(201).json({ ok: true, message: "Group chat successfully created" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, message: "An error occured while creating group chat" })
    }
};

// Get Chat Details
export async function getChatDetails(req: Request, res: Response) {
    try {
        const user = req.user;
        const { chatId } = req.params as { chatId: string };

        if (!chatId) {
            return res.status(400).json({ ok: false, message: "Chat ID not provided" });
        };


        const chat = await prisma.conversation.findUnique({
            where: { id: chatId, members: { some: { userId: user.id } } },
            select: {
                name: true,
                isGroup: true,
                members: true,
            }
        });


        if (!chat) {
            return res.status(404).json({ ok: false, message: "Chat not found or forbidden" });
        };


        return res.status(200).json({ ok: true, chat })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, message: "Failed to get chat details" })
    }
};

// leave chat
export async function leaveChat(req: Request, res: Response) {
    try {
        const user = req.user;
        const { chatId } = req.params as { chatId: string };


        const leftUser = await prisma.conversationMember.delete({
            where: {
                conversationId_userId: {
                    conversationId: chatId,
                    userId: user.id
                }
            }
        })

        if (!leftUser) {
            return res.status(404).json({ ok: false, messaege: "Chat not found or forbidden" })
        };

        return res.status(200).json({ ok: true, message: "You left the chat" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, message: "Failed to leave chat" });
    }
}