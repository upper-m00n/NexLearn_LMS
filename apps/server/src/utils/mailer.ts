import Mailjet from 'node-mailjet';

// 1. Initialize the Mailjet client with your API keys
const mailjet = new Mailjet({
  apiKey: process.env.MAILJET_API_KEY,
  apiSecret: process.env.MAILJET_SECRET_KEY,
});

// 2. Create the new email sending function
export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const request = await mailjet
      .post('send', { 'version': 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: "your-verified-email@domain.com", // IMPORTANT: Must be a verified sender
              Name: "NexLearn"
            },
            To: [
              {
                Email: to,
              }
            ],
            Subject: subject,
            HTMLPart: html,
          }
        ]
      });

    console.log("Email sent successfully via Mailjet API:", request.body);
  } catch (error) {
    console.error("Error sending email via Mailjet API:", error);
    throw new Error("Could not send verification email.");
  }
};