
import admin from 'firebase-admin';
import nodemailer from 'nodemailer';

// Initialize Firebase Admin with service account
if (!admin.apps.length) {
  try {
    const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (serviceAccountStr) {
      admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(serviceAccountStr)),
      });
    }
  } catch (e) {
    console.error("Firebase Admin initialization skipped or failed");
  }
}

/**
 * Configure the email transporter using Brevo (formerly Sendinblue) SMTP Relay.
 */
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, // Port 587 uses STARTTLS
  requireTLS: true,
  auth: {
    user: '9ea775001@smtp-brevo.com',
    pass: 'xsmtpsib-e3af5b0206258ce8a7089d722be193468b448e980b2f26bb04305d2a7dcf66d6-pwcOSkzgzQ4zDMoL',
  },
  // Aggressive timeouts to prevent hanging the event loop
  connectionTimeout: 8000, 
  greetingTimeout: 5000,    
  socketTimeout: 10000,     
});

/**
 * Sends an OTP email to the user with a hard timeout wrapper.
 */
export const sendOtpEmail = async (email: string, otp: string) => {
  console.log(`[SMTP] Attempting delivery to: ${email}`);
  
  const mailOptions = {
    from: `"CheckCalendar Pro" <9ea775001@smtp-brevo.com>`,
    to: email,
    subject: 'Your CheckCalendar Verification Code',
    text: `Your verification code is: ${otp}`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 20px auto; padding: 30px; border: 1px solid #eee; border-radius: 20px; text-align: center;">
        <h1 style="color: #2563eb; margin-bottom: 20px;">CheckCalendar</h1>
        <p style="color: #666; font-size: 16px;">Use the code below to sign in:</p>
        <div style="background: #f4f7ff; padding: 20px; border-radius: 12px; margin: 25px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #1e40af;">${otp}</span>
        </div>
        <p style="color: #999; font-size: 12px;">Valid for 5 minutes.</p>
      </div>
    `,
  };

  // Wrap the mail sending in a promise that times out after 12 seconds
  return Promise.race([
    transporter.sendMail(mailOptions),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('SMTP service timed out after 12s')), 12000)
    )
  ]).then(info => {
    console.log('[SMTP] Delivery successful');
    return true;
  }).catch(error => {
    console.error('[SMTP] Delivery failed:', error.message);
    throw error;
  });
};
