const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://dhwajaflare.com",
    ],
  })
);

// Configure transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

// Verify transporter
transporter.verify((error) => {
  if (error) {
    console.log("Email configuration error:", error);
  } else {
    console.log("Email server is ready");
  }
});

// POST endpoint
app.post("/send-mail", async (req, res) => {
  try {
    console.log("Received request:", req.body);

    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const mailOptions = {
      from: `"Dhwaja Flare Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Mail sent to yourself
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "Not Provided"}</p>

        <h3>Message:</h3>
        <p>${message}</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Mail sent:", info.messageId);

    res.status(200).json({
      success: true,
      message: "Mail sent successfully",
    });
  } catch (error) {
    console.log("Error sending mail:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send mail",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
