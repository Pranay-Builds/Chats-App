import cron from "node-cron";
import { prisma } from "../lib/prisma.js";


 export async function cleanUnverifiedUsers() {
     cron.schedule("0 * * * *", async () => {
       const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
     
       await prisma.user.deleteMany({
         where: {
             emailVerified: false,
             createdAt: { lt: cutoff },
         }
       });
     
       console.log("Cleaned unverified users");
     });
}
