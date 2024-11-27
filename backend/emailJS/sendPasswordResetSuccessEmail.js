import nodemailer from "nodemailer";
import { PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailTemplate.js";

export const sendPasswordResetSuccessEmail = async (email) => {
    try {
        // Create a transporter using Gmail's SMTP
        const transporter = nodemailer.createTransport({
            service: "gmail", // Gmail SMTP service
            auth: {
                user: "nodemailexpress@gmail.com", // Replace with your Gmail address
                pass: "ilkx hstg gpjs fbvc",       // Replace with your Gmail app-specific password
            },
        });

        // Send email
        const info = await transporter.sendMail({
            from: '"XpressAuth" <nodemailexpress@gmail.com>', // sender address
            to: email,                                        // recipient email
            subject: "Password Reset Successful",            // subject line
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,           // email body
        });

        // console.log("Email sent successfully:", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};
