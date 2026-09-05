import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.mailtrap.io",
  port: process.env.SMTP_PORT || 2525,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendTicketNotification({ to, subject, message }) {
  if (!to) return;
  try {
    await transporter.sendMail({
      from: `"Support System" <${process.env.SMTP_FROM || "no-reply@texora.com"}>`,
      to,
      subject,
      text: message,
      html: `<div style="font-family:sans-serif;padding:20px;border-radius:8px;border:1px solid #e2e8f0;">
        <h3 style="color:#4f46e5;margin-top:0;">Support System Notification</h3>
        <p style="color:#334155;font-size:14px;line-height:1.5;">${message}</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;" />
        <p style="color:#94a3b8;font-size:12px;">This is an automated notification from your ticket platform.</p>
      </div>`,
    });
  } catch (error) {
    console.error("🔥 Failed to send email notification:", error);
  }
}
