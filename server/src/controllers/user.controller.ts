import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import { cloudinary } from "../lib/cloudinary.js";


export async function uploadUserAvatar(req: Request, res: Response) {
    try {
        const user = req.user;
        console.log("USER: ", user)

        if (!req.file) {
            return res.status(400).json({
                ok: false,
                message: "Avatar file not found"
            });
        }

        const file = req.file.buffer;

        const existingUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { imagePublicId: true }
        });


        // delete old avatar file
        if (existingUser?.imagePublicId) {
            await cloudinary.uploader.destroy(
                existingUser.imagePublicId
            );
        };

        const avatarUrl = await uploadToCloudinary({
            fileBuffer: file,
            folderName: "chats/avatars"
        });


        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                image: avatarUrl.url,
                imagePublicId: avatarUrl.publicId,
            }
        });

        res.json({
            ok: true,
            avatarUrl,
            message: "Avatar uploaded successfully"
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Avatar upload failed"
        });
    }
};


export async function updateUserProfile(req: Request, res: Response) {
    try {
        const user = req.user;

        const { name, bio } = req.body;

        if (!name && !bio) {
            return res.status(400).json({
                ok: false,
                message: "Please fill in either name or bio or both"
            });
        };


        if (name.length > 25 || name.length < 3) {
            return res.status(400).json({
                ok: false,
                message: "Name must be between 3 to 25 characters"
            });
        };


        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                name: name,
                bio: bio,
            }
        });


        res.json({
            ok: true,
            message: "Account uploaded successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Profile upload failed"
        });
    }
};


export async function getUserProfile(req: Request, res: Response) {
    try {
        const user = req.user;

        const profile = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
                id: true,
                name: true,
                bio: true,
                image: true,
                email: true,
                friendCode: true,
                createdAt: true,
            }
        });

        return res.status(200).json({ ok: true, user: profile })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ ok: false, message: "Failed to get profile data, Please try again later" })
    }
}