import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.mailtrap.io",
  port: parseInt(process.env.SMTP_PORT || "2525"),
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  // Added to bypass strict OpenSSL handshake mismatches on test/cloud servers
  tls: {
    rejectUnauthorized: false,
    minVersion: "TLSv1.2",
  },
});

export async function sendPasswordResetEmail(toEmail, resetToken) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: `"TEXORA Support" <${process.env.EMAIL_FROM || "noreply@texora.com"}>`,
    to: toEmail,
    subject: "Password Reset Request - TEXORA",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #0f172a;">TEXORA Password Reset</h2>
        <p style="color: #475569; font-size: 14px;">You requested a password reset for your TEXORA account. Click the button below to choose a new password. This link is valid for 1 hour.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">Reset Password</a>
        </div>
        <p style="color: #94a3b8; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  };

  // Safe dispatch with fail-safe error handling for E2E and network drops
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.warn("SMTP email delivery skipped/failed:", error.message);
    if (
      process.env.NODE_ENV === "production" &&
      !process.env.ALLOW_EMAIL_FAILURES
    ) {
      throw error; // Only throw hard in strict production if configured
    }
  }
}
