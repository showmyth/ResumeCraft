const wrapper = (title, bodyHtml) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${title}</title></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;">
        <tr><td style="background:#4f46e5;padding:24px 32px;">
          <span style="color:#ffffff;font-size:18px;font-weight:700;">ResumeCraft</span>
        </td></tr>
        <tr><td style="padding:32px;">
          ${bodyHtml}
        </td></tr>
        <tr><td style="padding:16px 32px;background:#fafafa;">
          <p style="margin:0;color:#a1a1aa;font-size:12px;">If you didn't request this, you can safely ignore this email.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

export function passwordResetEmail({ name, resetUrl }) {
  const html = wrapper(
    "Reset your password",
    `
    <h1 style="margin:0 0 12px;font-size:20px;color:#18181b;">Reset your password</h1>
    <p style="margin:0 0 20px;font-size:14px;color:#52525b;line-height:1.6;">Hi ${name || "there"}, we received a request to reset your ResumeCraft password. This link expires in 1 hour.</p>
    <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#4f46e5;color:#ffffff;text-decoration:none;border-radius:10px;font-size:14px;font-weight:600;">Reset Password</a>
    <p style="margin:20px 0 0;font-size:12px;color:#a1a1aa;">Or paste this link into your browser:<br>${resetUrl}</p>
    `
  );
  return {
    subject: "Reset your ResumeCraft password",
    html,
    text: `Reset your password: ${resetUrl} (expires in 1 hour)`,
  };
}

export function welcomeEmail({ name }) {
  const html = wrapper(
    "Welcome to ResumeCraft",
    `
    <h1 style="margin:0 0 12px;font-size:20px;color:#18181b;">Welcome, ${name || "there"} 👋</h1>
    <p style="margin:0 0 20px;font-size:14px;color:#52525b;line-height:1.6;">
      You're all set. Start by taking the 30-second domain quiz to find the resume layout built for your CS specialization — or jump straight into the builder if you already know your domain.
    </p>
    `
  );
  return {
    subject: "Welcome to ResumeCraft 🎉",
    html,
    text: `Welcome to ResumeCraft, ${name || "there"}!`,
  };
}
