
import { Resend } from 'resend';
import { logger } from './logger';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM || 'Techpadie <noreply@techpadie.com>';

interface SendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

async function send(
  to: string,
  subject: string,
  html: string
): Promise<SendResult> {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to,
      subject,
      html,
    });

    if (error) {
      logger.error('Email send failed', new Error(error.message), {
        to,
        subject,
      });
      return { success: false, error: error.message };
    }

    logger.info('Email sent', { to, subject, messageId: data?.id });
    return { success: true, messageId: data?.id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown email error';
    logger.error('Email send exception', new Error(msg), { to, subject });
    return { success: false, error: msg };
  }
}

// ─── Email Templates ────────────────────────────────────────────

export async function sendOTPEmail(
  to: string,
  code: string,
  displayName: string
): Promise<SendResult> {
  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #227FA1; margin-bottom: 8px;">Techpadie</h2>
      <p>Hi ${displayName},</p>
      <p>Your login verification code is:</p>
      <div style="
        background: #F1F5F9;
        border-radius: 12px;
        padding: 20px;
        text-align: center;
        margin: 24px 0;
      ">
        <span style="
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 8px;
          color: #0F172A;
        ">${code}</span>
      </div>
      <p style="color: #64748B; font-size: 14px;">
        This code expires in 10 minutes. Do not share it with anyone.
      </p>
      <p style="color: #64748B; font-size: 14px;">
        If you didn't request this, you can safely ignore this email.
      </p>
    </div>
  `;

  return send(to, 'Your Techpadie Login Code', html);
}

export async function sendWelcomeEmail(
  to: string,
  displayName: string
): Promise<SendResult> {
  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #227FA1; margin-bottom: 8px;">Welcome to Techpadie!</h2>
      <p>Hi ${displayName},</p>
      <p>Your account has been created successfully. Start learning blockchain and digital skills today.</p>
      <a href="${process.env.APP_URL}/dashboard" style="
        display: inline-block;
        background: #227FA1;
        color: white;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: bold;
        margin-top: 16px;
      ">Go to Dashboard</a>
      <p style="color: #64748B; font-size: 14px; margin-top: 24px;">
        Happy learning!<br>The Techpadie Team
      </p>
    </div>
  `;

  return send(to, 'Welcome to Techpadie', html);
}

export async function sendPasswordResetEmail(
  to: string,
  code: string,
  displayName: string
): Promise<SendResult> {
  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #227FA1; margin-bottom: 8px;">Techpadie</h2>
      <p>Hi ${displayName},</p>
      <p>You requested a password reset. Use this code:</p>
      <div style="
        background: #F1F5F9;
        border-radius: 12px;
        padding: 20px;
        text-align: center;
        margin: 24px 0;
      ">
        <span style="
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 8px;
          color: #0F172A;
        ">${code}</span>
      </div>
      <p style="color: #64748B; font-size: 14px;">
        This code expires in 10 minutes.
      </p>
      <p style="color: #64748B; font-size: 14px;">
        If you didn't request a password reset, someone may be trying to access
        your account. You can safely ignore this email.
      </p>
    </div>
  `;

  return send(to, 'Reset Your Techpadie Password', html);
}

export async function sendCreatorApprovedEmail(
  to: string,
  displayName: string
): Promise<SendResult> {
  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #227FA1;">You're Approved! 🎉</h2>
      <p>Hi ${displayName},</p>
      <p>Your course creator application has been approved. You can now create and publish courses on Techpadie.</p>
      <a href="${process.env.APP_URL}/dashboard/creator" style="
        display: inline-block;
        background: #227FA1;
        color: white;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: bold;
        margin-top: 16px;
      ">Start Creating</a>
    </div>
  `;

  return send(to, 'Creator Account Approved — Techpadie', html);
}

export async function sendCreatorRejectedEmail(
  to: string,
  displayName: string,
  reason: string
): Promise<SendResult> {
  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #227FA1;">Application Update</h2>
      <p>Hi ${displayName},</p>
      <p>Unfortunately, your course creator application was not approved at this time.</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p style="color: #64748B; font-size: 14px;">
        You can update your profile and re-apply. If you have questions, reach out to our support team.
      </p>
    </div>
  `;

  return send(to, 'Creator Application Update — Techpadie', html);
}