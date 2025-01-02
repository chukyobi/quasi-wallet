import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false, // Use true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
/**
 * Sends a verification email using Brevo (Sendinblue).
 * 
 * @param {string} to - The recipient's email address.
 * @param {string} otp - The OTP code to include in the email.
 * @returns {Promise<boolean>} - Returns true if email sent successfully.
 */

async function sendVerificationEmail(to: string, otp: string): Promise<boolean> {
    const mailOptions = {
        from: `Goldman Private <no-reply@goldmanprivate.com>`,   
        to,
        subject: 'Account Verification',
        html: `
            <div>
                <h2>Account Verification</h2>
                <p>Thank you for joining us! Your OTP is below:</p>
                <p style="font-size: 24px; font-weight: bold;">${otp}</p>
                <p>This OTP is valid for 15 minutes.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent to:', to);
        return true;
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Failed to send verification email');
    }
}

export default sendVerificationEmail;
