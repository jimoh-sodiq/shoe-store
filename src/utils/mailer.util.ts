import nodemailer from "nodemailer";
import globalConfig from "../core/config";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  secure: false,
  auth: {
    user: globalConfig.nodemailer.username,
    pass: globalConfig.nodemailer.password,
  },
});

export async function sendEmail(mailOptions: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    await transporter.sendMail({
      from: globalConfig.nodemailer.username,
      to: mailOptions.to,
      subject: mailOptions.subject,
      html: mailOptions.html,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
