import nodemailer from 'nodemailer';
import mailgun from 'mailgun-js';

// Mailgun Configuration
const mailgunClient = mailgun({
    apiKey: process.env.MAILGUN_API_KEY!,
    domain: process.env.MAILGUN_DOMAIN!,
});


// Create a Nodemailer transport using the Mailgun transporter
const transporter = nodemailer.createTransport({
    service: 'Mailgun',
    auth: {
        user: process.env.MAILGUN_SMTP_USERNAME!,
        pass: process.env.MAILGUN_API_PASS!,
    },
});


/**
 * Sends a verification email using Mailgun.
 * 
 * @param {string} to - The recipient's email address.
 * @param {string} otp - The OTP code to include in the email.
 * @returns {Promise<boolean>} - Returns true if email sent successfully.
 */
async function sendVerificationEmail(to: string, otp: string): Promise<boolean> {
    const mailOptions = {
        from: `YourAppName <noreply@${process.env.MAILGUN_DOMAIN}>`,
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
