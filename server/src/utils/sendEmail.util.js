const nodemailer = require("nodemailer");
require("dotenv").config();

function sendEmailActiveAccount(user) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ACCOUNT,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_ACCOUNT,
    to: user.email,
    subject: "Please verify your email to use the Ongaku-v2 services",
    text: `Click this link to verify your email ${process.env.BACKEND}/user/verify_email/${user._id}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log("Error while sending email:", error);
    }
    console.log("Email sent successfully:", info.response);
  });
}

function sendEmailForgetPassword(user) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ACCOUNT,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_ACCOUNT,
    to: user.email,
    subject: "New password Ongaku-v2",
    text: `Your new password is : ${user.password}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log("Error while sending email:", error);
    }
    console.log("Email sent successfully:", info.response);
  });
}

module.exports = { sendEmailActiveAccount, sendEmailForgetPassword };
