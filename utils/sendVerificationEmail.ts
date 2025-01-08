import sgMail from '@sendgrid/mail';

// Set the SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

/**
 * Sends a verification email using SendGrid.
 * 
 * @param {string} to - The recipient's email address.
 * @param {string} otp - The OTP code to include in the email.
 * @returns {Promise<boolean>} - Returns true if email sent successfully.
 */
async function sendVerificationEmail(to: string, otp: string): Promise<boolean> {
    const msg = {
        to, // Recipient's email address
        from: 'no-reply@goldmanprivate.com', // Verified sender email
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
        await sgMail.send(msg);
        console.log('Verification email sent to:', to);
        return true;
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Failed to send verification email');
    }
}

export default sendVerificationEmail;
