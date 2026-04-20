export const OTPMailTemplate = (otp: string): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>OTP Verification</title>
</head>

<body style="margin:0; padding:0; background-color:#f4f4f5; font-family:Inter, Arial, sans-serif;">

  <!-- Wrapper -->
  <div style="padding:40px 16px;">

    <!-- Card Container -->
    <div style="max-width:520px; margin:0 auto; background:#131315; border-radius:16px; padding:32px;">

      <!-- Logo -->
      <div style="font-size:20px; font-weight:600; margin-bottom:24px; color:#ba9eff;">
        NoteFlow
      </div>

      <!-- Title -->
      <div style="font-size:24px; font-weight:600; margin-bottom:12px; color:#ffffff;">
        Verify your email
      </div>

      <!-- Subtitle -->
      <div style="font-size:14px; color:#adaaad; margin-bottom:28px; line-height:1.6;">
        Use the following One-Time Password (OTP) to complete your verification. This code is valid for a limited time.
      </div>

      <!-- OTP Label -->
      <div style="font-size:13px; color:#adaaad; margin-bottom:10px;">
        Your verification code is:
      </div>

      <!-- OTP Box -->
      <div style="
        background:#1f1f22;
        border-radius:12px;
        padding:24px;
        text-align:center;
        font-size:30px;
        font-weight:700;
        letter-spacing:10px;
        color:#ffffff;
        margin-bottom:16px;
      ">
        ${String(otp).split("").join(" ")}
      </div>

      <!-- Info -->
      <div style="font-size:13px; color:#adaaad; margin-top:20px;">
        For your security, do not share this code with anyone.
      </div>

      <!-- Warning -->
      <div style="font-size:13px; color:#ff6e84; margin-top:8px;">
        This code will expire in 5 minutes.
      </div>

      <!-- Footer -->
      <div style="margin-top:32px; font-size:12px; color:#6b7280; text-align:center;">
        If you did not request this, you can safely ignore this email.
      </div>

    </div>

  </div>

</body>
</html>
`;
};

export const resetPasswordMailTemplate = (resetLink: string): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Reset Password</title>
</head>

<body style="margin:0; padding:0; background-color:#f4f4f5; font-family:Inter, Arial, sans-serif;">

  <!-- Wrapper -->
  <div style="padding:40px 16px;">

    <!-- Card Container -->
    <div style="max-width:520px; margin:0 auto; background:#131315; border-radius:16px; padding:32px;">

      <!-- Logo -->
      <div style="font-size:20px; font-weight:600; margin-bottom:24px; color:#ba9eff;">
        NoteFlow
      </div>

      <!-- Title -->
      <div style="font-size:24px; font-weight:600; margin-bottom:12px; color:#ffffff;">
        Reset your password
      </div>

      <!-- Subtitle -->
      <div style="font-size:14px; color:#adaaad; margin-bottom:28px; line-height:1.6;">
        We received a request to reset your password. Click the button below to set a new password.
      </div>

      <!-- Button -->
      <div style="text-align:center; margin-bottom:24px;">
        <a href="${resetLink}" 
           style="
             display:inline-block;
             padding:14px 28px;
             border-radius:999px;
             background:linear-gradient(135deg, #ba9eff, #9093ff);
             color:#000000;
             font-size:14px;
             font-weight:600;
             text-decoration:none;
           ">
          Reset Password
        </a>
      </div>

      <!-- Fallback Link -->
      <div style="font-size:13px; color:#adaaad; margin-bottom:16px; line-height:1.5;">
        If the button doesn’t work, copy and paste this link into your browser:
      </div>

      <div style="
        background:#1f1f22;
        border-radius:10px;
        padding:12px;
        font-size:12px;
        color:#ffffff;
        word-break:break-all;
        margin-bottom:20px;
      ">
        ${resetLink}
      </div>

      <!-- Info -->
      <div style="font-size:13px; color:#adaaad;">
        For security reasons, this link will expire in 5 minutes.
      </div>

      <!-- Warning -->
      <div style="font-size:13px; color:#ff6e84; margin-top:8px;">
        If you did not request a password reset, you can safely ignore this email.
      </div>

      <!-- Footer -->
      <div style="margin-top:32px; font-size:12px; color:#6b7280; text-align:center;">
        This link is valid for one-time use only.
      </div>

    </div>

  </div>

</body>
</html>
`;
};
