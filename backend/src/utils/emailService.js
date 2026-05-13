const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTPEmail = async (to, name, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: '🔐 ReliefLink - Password Reset OTP',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Arial', sans-serif; background: #0f0f1a; margin: 0; padding: 20px; }
          .container { max-width: 500px; margin: 0 auto; background: #1a1a2e; border-radius: 16px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #e74c3c, #c0392b); padding: 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .header p { color: rgba(255,255,255,0.8); margin: 5px 0 0; }
          .body { padding: 30px; color: #e0e0e0; }
          .otp-box { background: linear-gradient(135deg, #e74c3c20, #c0392b20); border: 2px solid #e74c3c; border-radius: 12px; text-align: center; padding: 25px; margin: 25px 0; }
          .otp-code { font-size: 48px; font-weight: bold; color: #e74c3c; letter-spacing: 10px; font-family: monospace; }
          .warning { background: rgba(255,165,0,0.1); border-left: 4px solid orange; padding: 12px 16px; border-radius: 0 8px 8px 0; margin: 20px 0; font-size: 14px; }
          .footer { padding: 20px 30px; background: #0f0f1a; text-align: center; color: #555; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚨 ReliefLink</h1>
            <p>Disaster Relief Management System</p>
          </div>
          <div class="body">
            <p>Hello <strong>${name}</strong>,</p>
            <p>You requested to reset your password. Use the OTP below:</p>
            <div class="otp-box">
              <div class="otp-code">${otp}</div>
              <p style="margin: 10px 0 0; color: #aaa; font-size: 14px;">Valid for <strong>10 minutes</strong></p>
            </div>
            <div class="warning">
              ⚠️ If you did not request this, please ignore this email. Your account is safe.
            </div>
            <p>Stay safe,<br/><strong>The ReliefLink Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2024 ReliefLink. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOTPEmail };
