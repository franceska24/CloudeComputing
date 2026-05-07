import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendEmail({ to, subject, text }) {
  try {
    const msg = {
      to,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject,
      text,
    };

    await sgMail.send(msg);
    console.log("EMAIL TRIMIS OK");
  } catch (error) {
    console.error("SENDGRID ERROR:", error);
  }
}
