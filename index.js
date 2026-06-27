const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;
app.use(
  cors({
    origin: [
      "https://dhwajaflare.com",
      "http://localhost:5173"
    ],
    credentials: true,
  })
);
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error) => {
  if (error) {
    console.log("Email config error:", error);
  } else {
    console.log("Email server is ready");
  }
});

app.post("/send-mail", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

      const mailOptions = {
  from: `"Dhwaja Flare Website" <${process.env.EMAIL_USER}>`,
  to: process.env.EMAIL_USER,
  replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Request</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>

        <h3>Message:</h3>
        <p>${message}</p>
      `,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({
      success: true,
      message: "Mail sent successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to send mail",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});