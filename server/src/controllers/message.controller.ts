import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";


export async function getChatMessages(req: Request, res: Response) {
    try {
        const user = req.user;
        const { chatId } = req.params as { chatId: string };

        if (!chatId) {
            return res.status(400).json({ ok: false, message: "Chat ID not found" });
        };


        // Check if user is member of chat
        const chat = await prisma.conversation.findFirst({
            where: {
                id: chatId,
                members: {
                    some: {
                        userId: user.id
                    }
                },
            },
            include: {
                messages: {
                    select: {
                        sender: { select: { name: true, image: true } },
                        content: true,
                        createdAt: true,
                        reads: true
                    },
                    orderBy: {
                        createdAt: "asc",
                    },
                    take: 30,
                }
            }
        });


        if (!chat) {
            return res.status(404).json({ ok: false, message: "Either chat does not exist or you are not a member of it " });
        };

        return res.status(200).json({ ok: true, chat });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, message: "Failed to get messages of a chat" });
    }
};


export async function sendMessage(req: Request, res: Response) {
    try {
        const user = req.user;
        const { chatId, content, friendId } = req.body;

        // ✅ correct validation
        if (!content) {
            return res.status(400).json({
                ok: false,
                message: "Content missing"
            });
        }

        if (!chatId && !friendId) {
            return res.status(400).json({
                ok: false,
                message: "Either chatId or friendId required"
            });
        }

        if (content.length > 500) {
            return res.status(400).json({
                ok: false,
                message: "Message too long"
            });
        }

        const message = await prisma.$transaction(async (tx) => {

            let conversationId = chatId;

            // ✅ CASE 1 — first message (no chatId)
            if (!conversationId) {

                // check friendship
                const friendship = await tx.friendship.findFirst({
                    where: {
                        OR: [
                            { user1Id: user.id, user2Id: friendId },
                            { user1Id: friendId, user2Id: user.id }
                        ]
                    }
                });

                if (!friendship) {
                    throw new Error("NOT_FRIENDS");
                }

                // ✅ SAFE lookup for existing 1:1 chat
                let existingChat = await tx.conversation.findFirst({
                    where: {
                        isGroup: false,
                        AND: [
                            {
                                members: {
                                    some: { userId: user.id }
                                }
                            },
                            {
                                members: {
                                    some: { userId: friendId }
                                }
                            }
                        ]
                    },
                    include: {
                        members: true
                    }
                });

                // ensure true 1:1 chat
                if (existingChat && existingChat.members.length !== 2) {
                    existingChat = null;
                }

                // create if not exists
                if (!existingChat) {
                    existingChat = await tx.conversation.create({
                        data: {
                            isGroup: false,
                            members: {
                                create: [
                                    { userId: user.id },
                                    { userId: friendId }
                                ]
                            }
                        },
                        include: {
                            members: true
                        }
                    });

                }

                conversationId = existingChat.id;
            }

            // verify membership
            const membership = await tx.conversationMember.findFirst({
                where: {
                    conversationId,
                    userId: user.id
                }
            });

            if (!membership) {
                throw new Error("NOT_MEMBER");
            }

            const newMessage = await tx.message.create({
                data: {
                    conversationId,
                    senderId: user.id,
                    content
                }
            });

            await tx.conversation.update({
                where: { id: conversationId },
                data: {
                    lastMessage: content,
                    lastMessageAt: newMessage.createdAt
                }
            });

            return newMessage;
        });

        return res.status(201).json({ ok: true, message });

    } catch (error) {
        console.error(error);

        // ✅ proper business errors
        if (error instanceof Error) {
            if (error.message === "NOT_FRIENDS") {
                return res.status(403).json({
                    ok: false,
                    message: "You can only message friends"
                });
            }

            if (error.message === "NOT_MEMBER") {
                return res.status(403).json({
                    ok: false,
                    message: "You are not part of this chat"
                });
            }
        }

        return res.status(500).json({
            ok: false,
            message: "Failed to send message"
        });
    }
}
