import express, { Request, Response } from "express";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";

import { corsOptions } from "./corsOptions";
import { limiter } from "./rateLimiter";

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.options("/send-email", cors(corsOptions));
app.post("/send-email", limiter, async (req: Request, res: Response) => {
  const { name, email, service, message } = req.body;
  console.log(req.body);

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  console.log(process.env.GMAIL_USER);
  console.log(process.env.GMAIL_PASSWORD);

  console.log(transporter);

  const mailOptions = {
    from: process.env.GMAIL_USER!,
    to: "muharridody@gmail.com",
    subject: "New Submission",
    text: `
      You've got a new request collaboration!

      Name/Organization: ${name}
      Email: ${email}
      Service: ${service}
      Message: ${message}
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent successfully", info });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
