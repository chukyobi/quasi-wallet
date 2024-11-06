import nodemailer from 'nodemailer';

// Brevo (Sendinblue) Configuration
const transporter = nodemailer.createTransport({
    host: 'smtp-relay.sendinblue.com',
    port: 587, // Use 465 for SSL or 587 for TLS
    secure: false, // Use TLS
    auth: {
        user: process.env.BREVO_SMTP_USERNAME,  // Your Brevo SMTP username (API Key)
        pass: process.env.BREVO_SMTP_PASSWORD,  // Your Brevo SMTP password (API Key)
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
        from: `YourAppName <noreply@yourdomain.com>`,  // Use your own "From" address
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
