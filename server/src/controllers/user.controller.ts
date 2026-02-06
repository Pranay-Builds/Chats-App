import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";


export async function uploadUserAvatar(req: Request, res: Response) {
    try {
        const user = req.user;

        if (!req.file) {
            return res.status(400).json({ ok: false, message: "Avatar file not found" });
        };

        
    } catch (error) {
        
    }
}