import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { io } from "../index.js";

export async function getChatMessages(req: Request, res: Response) {
  try {
    const user = req.user;
    const { chatId } = req.params as { chatId: string };

    if (!chatId) {
      return res.status(400).json({ ok: false, message: "Chat ID not found" });
    }

    // Check if user is member of chat
    const chat = await prisma.conversation.findUnique({
      where: {
        id: chatId,
      },

      include: {
        members: {
          include: {
            user: true,
          },
        },

        messages: {
          include: {
            sender: true,

            reads: {
              include: {
                user: true,
              },
            },
          },

          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!chat) {
      return res.status(404).json({
        ok: false,
        message: "Either chat does not exist or you are not a member of it ",
      });
    }

    return res.status(200).json({ ok: true, chat });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ ok: false, message: "Failed to get messages of a chat" });
  }
}

export async function sendMessage(req: Request, res: Response) {
  try {
    const user = req.user;
    const { chatId, content, friendId } = req.body;

    // validation
    if (!content?.trim()) {
      return res.status(400).json({
        ok: false,
        message: "Content missing",
      });
    }

    if (!chatId && !friendId) {
      return res.status(400).json({
        ok: false,
        message: "Either chatId or friendId required",
      });
    }

    if (content.length > 500) {
      return res.status(400).json({
        ok: false,
        message: "Message too long",
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      let conversationId = chatId;

      // =========================
      // FIRST MESSAGE CASE
      // =========================
      if (!conversationId) {
        // verify friendship
        const friendship = await tx.friendship.findFirst({
          where: {
            OR: [
              {
                user1Id: user.id,
                user2Id: friendId,
              },
              {
                user1Id: friendId,
                user2Id: user.id,
              },
            ],
          },
        });

        if (!friendship) {
          throw new Error("NOT_FRIENDS");
        }

        let existingChat = await tx.conversation.findFirst({
          where: {
            isGroup: false,
            AND: [
              {
                members: {
                  some: {
                    userId: user.id,
                  },
                },
              },
              {
                members: {
                  some: {
                    userId: friendId,
                  },
                },
              },
            ],
          },
          include: {
            members: true,
          },
        });

        if (existingChat && existingChat.members.length !== 2) {
          existingChat = null;
        }

        if (!existingChat) {
          existingChat = await tx.conversation.create({
            data: {
              isGroup: false,
              members: {
                create: [
                  {
                    userId: user.id,
                  },
                  {
                    userId: friendId,
                  },
                ],
              },
            },
            include: {
              members: true,
            },
          });
        }

        // FIX 1: Assign conversationId from the found/created chat
        conversationId = existingChat.id;
      } else {
        // =========================
        // VERIFY MEMBERSHIP
        // FIX 2: Only verify membership when using an existing chatId,
        // not when creating a new conversation via friendId
        // =========================
        const membership = await tx.conversationMember.findFirst({
          where: {
            conversationId,
            userId: user.id,
          },
        });

        if (!membership) {
          throw new Error("NOT_MEMBER");
        }
      }

      // =========================
      // CREATE MESSAGE
      // =========================
      const newMessage = await tx.message.create({
        data: {
          conversationId,
          senderId: user.id,
          content: content.trim(),
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      // =========================
      // UPDATE CONVERSATION
      // =========================
      await tx.conversation.update({
        where: {
          id: conversationId,
        },
        data: {
          lastMessage: content.trim(),
          lastMessageAt: newMessage.createdAt,
        },
      });

      return {
        newMessage,
        conversationId,
      };
    });

    // =========================
    // SOCKET EVENT
    // =========================
    io.to(result.conversationId).emit("new-message", result.newMessage);

    return res.status(201).json({
      ok: true,
      message: result.newMessage,
    });
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      if (error.message === "NOT_FRIENDS") {
        return res.status(403).json({
          ok: false,
          message: "You can only message friends",
        });
      }

      if (error.message === "NOT_MEMBER") {
        return res.status(403).json({
          ok: false,
          message: "You are not part of this chat",
        });
      }
    }

    return res.status(500).json({
      ok: false,
      message: "Failed to send message",
    });
  }
}
