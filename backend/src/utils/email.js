import nodemailer from 'nodemailer';

// Create transporter only if email is configured
let transporter = null;
if (process.env.MAIL_HOST && process.env.MAIL_USER) {
  transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD
    }
  });
}

export const sendPasswordResetEmail = async (email, name, resetUrl) => {
  try {
    if (!transporter) {
      console.warn('Email not configured. Skipping password reset email.');
      console.log('Reset URL for', email, ':', resetUrl);
      return;
    }

const mailOptions = {
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM}>`,
      to: email,
      subject: 'Reset your T-Shirt Store password',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7ff; color: #334155;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                  
                  <tr>
                    <td align="center" style="padding: 40px 20px; background-color: #1e40af;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -1px;">T-Shirt Store</h1>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="margin: 0 0 20px; font-size: 22px; color: #1e293b; font-weight: 700;">Password Reset Request</h2>
                      <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6;">Hello <strong style="color: #1e40af;">${name}</strong>,</p>
                      <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6;">We received a request to reset the password for your account. If you made this request, please click the button below to set a new password:</p>
                      
                      <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td align="center" style="padding: 20px 0;">
                            <a href="${resetUrl}" target="_blank" style="display: inline-block; padding: 16px 36px; background-color: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);">Reset Password</a>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 20px 0 10px; font-size: 14px; color: #64748b; text-align: center;">This link will expire in <strong>1 hour</strong>.</p>
                      
                      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;">

                      <p style="margin: 0 0 10px; font-size: 13px; color: #94a3b8;">If the button doesn't work, copy and paste this URL into your browser:</p>
                      <p style="margin: 0; font-size: 13px; color: #4f46e5; word-break: break-all;">${resetUrl}</p>
                      
                      <p style="margin: 30px 0 0; font-size: 14px; color: #64748b;">If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 30px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                      <p style="margin: 0 0 10px; font-size: 12px; color: #64748b;">&copy; ${new Date().getFullYear()} T-Shirt Store. All rights reserved.</p>
                      <p style="margin: 0; font-size: 12px; color: #94a3b8;">123 Fashion Street, Mumbai, India</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent to:', email);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendPasswordChangedEmail = async (email, name) => {
  try {
    if (!transporter) {
      console.warn('Email not configured. Skipping password changed email.');
      return;
    }

    const mailOptions = {
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM}>`,
      to: email,
      subject: 'Security Alert: Password Changed',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Changed</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7ff; color: #334155;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                  
                  <tr>
                    <td align="center" style="padding: 40px 20px; background-color: #1e40af;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -1px;">T-Shirt Store</h1>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="margin: 0 0 20px; font-size: 22px; color: #1e293b; font-weight: 700;">Password Successfully Changed</h2>
                      <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6;">Hello <strong style="color: #1e40af;">${name}</strong>,</p>
                      <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6;">This is a confirmation that the password for your T-Shirt Store account has been successfully changed.</p>
                      
                      <div style="background-color: #f8fafc; border-left: 4px solid #1e40af; padding: 15px; margin-bottom: 20px;">
                        <p style="margin: 0; font-size: 14px; color: #475569;">If you performed this action, no further steps are required.</p>
                      </div>

                      <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #dc2626; font-weight: 600;">If you did NOT change your password, please contact our support team immediately or try to reset your password again.</p>
                      
                      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;">

                      <p style="margin: 0; font-size: 14px; color: #64748b;">Thank you for helping us keep your account secure.</p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 30px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                      <p style="margin: 0 0 10px; font-size: 12px; color: #64748b;">&copy; ${new Date().getFullYear()} T-Shirt Store. All rights reserved.</p>
                      <p style="margin: 0; font-size: 12px; color: #94a3b8;">123 Fashion Street, Mumbai, India</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Password changed confirmation email sent to:', email);
  } catch (error) {
    console.error('Error sending password changed email:', error);
  }
};
