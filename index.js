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
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
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
    console.log("================================");
    console.log("New Request Received");
    console.log("Request Body:", req.body);

    const { name, email, phone, message } = req.body;

    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Phone:", phone);
    console.log("Message:", message);

    if (!name || !email || !message) {
      console.log("Validation failed");

      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
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

    console.log("Sending email...");

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully");
    console.log("Message ID:", info.messageId);

    res.status(200).json({
      success: true,
      message: "Mail sent successfully",
    });

  } catch (error) {
    console.log("Error while sending mail:");
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
