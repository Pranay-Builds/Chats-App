import { Request, Response } from "express";
import { auth } from "./auth.js";

export async function requireAuth(req: Request, res: Response) {
    const session = await auth.api.getSession();

    if (!session) {
        res.status(401).json({ message: "Unauthorized" });
        return null;
    }


    return session.user;
}