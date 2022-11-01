const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const nodeMailer = require("nodemailer");
const app = express();

const PORT = 5000;
app.use(cors({ origin: true }));

app.use(express.json());

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    auth: {
      user: "mailertestnew@zohomail.com",
      pass: "nodemailer",
    },
  });

  const mailOptions = {
    from: "mailertestnew@zohomail.com",
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
