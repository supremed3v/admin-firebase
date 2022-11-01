const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const nodeMailer = require("nodemailer");
const app = express();

const PORT = 5000;
app.use(cors({ origin: true }));

app.use(express.json());

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};
app.post("/status", async (req, res) => {
  const { email, subject, message } = req.body;
  try {
    await sendEmail({ email, subject, message });
    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
});

app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));

exports.mailApi = functions.https.onRequest(app);
