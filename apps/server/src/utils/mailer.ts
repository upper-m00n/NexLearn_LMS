import Mailjet from 'node-mailjet';

const mailjet = new Mailjet({
  apiKey: process.env.MAILJET_API_KEY,
  apiSecret: process.env.MAILJET_SECRET_KEY,
});


export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const request = await mailjet
      .post('send', { 'version': 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: "mr.proashutosh@gmail.com", 
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