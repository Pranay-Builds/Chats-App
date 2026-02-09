import { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.js";


declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export async function protect(req: Request, res: Response, next: NextFunction) {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });

        if (!session || !session.user) {
            // Send a 401 Unauthorized response 
            return res.status(401).json({ message: "Unauthorized" });
        }

        req.user = session.user;


        next();
    } catch (error) {
        // Handle potential errors during session fetching
        console.error("Authentication error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
