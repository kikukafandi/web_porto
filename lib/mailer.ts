/**
 * Email Service
 * Supports both SMTP (Nodemailer) and Resend
 */

import nodemailer from 'nodemailer';

const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || 'smtp';
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@example.com';

interface EmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send email using configured provider
 */
export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    if (EMAIL_PROVIDER === 'resend') {
      return await sendWithResend(params);
    } else {
      return await sendWithSMTP(params);
    }
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

/**
 * Send email via SMTP (Nodemailer)
 */
async function sendWithSMTP(params: EmailParams): Promise<boolean> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: EMAIL_FROM,
    to: params.to,
    subject: params.subject,
    text: params.text || '',
    html: params.html,
  });

  return true;
}

/**
 * Send email via Resend
 */
async function sendWithResend(params: EmailParams): Promise<boolean> {
  // Note: In production, install and use @resend/node package
  // For now, we'll use fetch API
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    console.error('Resend API key not configured');
    return false;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: params.to,
      subject: params.subject,
      html: params.html,
    }),
  });

  return response.ok;
}

/**
 * Generate invoice email HTML
 */
export function generateInvoiceEmail(
  buyerEmail: string,
  buyerName: string | null,
  productTitle: string,
  price: number,
  downloadUrl: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Purchase Invoice</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0;">Thank You for Your Purchase!</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <p>Hi ${buyerName || buyerEmail},</p>
    
    <p>Your payment has been successfully processed. Here are your purchase details:</p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h2 style="margin-top: 0; color: #667eea;">Order Details</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Product:</strong></td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right;">${productTitle}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Amount Paid:</strong></td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right;">Rp ${price.toLocaleString('id-ID')}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0;"><strong>Email:</strong></td>
          <td style="padding: 10px 0; text-align: right;">${buyerEmail}</td>
        </tr>
      </table>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${downloadUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold;">
        Download Your Product
      </a>
    </div>
    
    <p style="color: #666; font-size: 14px; margin-top: 30px;">
      <strong>Note:</strong> This download link is secure and will expire in 7 days.
    </p>
    
    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
    
    <p style="color: #999; font-size: 12px; text-align: center;">
      If you have any questions, please contact us at ${EMAIL_FROM}
    </p>
  </div>
</body>
</html>
  `;
}

/**
 * Send admin notification email
 */
export async function sendAdminNotification(
  productTitle: string,
  buyerEmail: string,
  price: number
): Promise<boolean> {
  return await sendEmail({
    to: process.env.ADMIN_EMAIL || 'admin@example.com',
    subject: `New Sale: ${productTitle}`,
    html: `
      <h2>New Product Sale</h2>
      <p><strong>Product:</strong> ${productTitle}</p>
      <p><strong>Buyer:</strong> ${buyerEmail}</p>
      <p><strong>Amount:</strong> Rp ${price.toLocaleString('id-ID')}</p>
      <p><strong>Time:</strong> ${new Date().toLocaleString('id-ID')}</p>
    `,
  });
}
