const dotenv = require("dotenv").config();
const nodemailer = require("nodemailer");

console.log(process.env.SMTP_HOST, process.env.SMTP_USER, process.env.SMTP_PASSWORD);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

module.exports = transporter;
