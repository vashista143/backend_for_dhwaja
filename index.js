const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(bodyParser.json());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://dhwajaflare.com"
  ]
}));

app.post("/send-mail", (req, res) => {
  const { name, email, phone, message } = req.body;

  console.log("Received:", req.body);

  // Replace your transporter creation logic with this:
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, 
    secure: true, // true for port 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Make sure this is a 16-character App Password
    },
    // Adding explicit timeouts to bypass aggressive network drops
    connectionTimeout: 10000, // 10 seconds
    socketTimeout: 10000,
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `New Contact Form Submission from ${name}`,
    text: `
Name: ${name}

Email: ${email}

Phone: ${phone || "Not provided"}

Message:
${message}
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Mail Error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to send mail",
      });
    }

    console.log("Email sent:", info.response);

    return res.status(200).json({
      success: true,
      message: "Mail sent successfully",
    });
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
