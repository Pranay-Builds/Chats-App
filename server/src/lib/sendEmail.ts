import dotenv from "dotenv";
dotenv.config();
import { Resend } from 'resend';

type Email = {
    to: string;
    subject: string;
    html: string;
}

const resend = new Resend(process.env.RESEND_API);


export async function sendEmail({ to, subject, html }: Email) {
    return await resend.emails.send({
        from: 'onboarding@resend.dev',
        to,
        subject,
        html,
    });
}
