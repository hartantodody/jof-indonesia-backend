"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const corsOptions_1 = require("./corsOptions");
const rateLimiter_1 = require("./rateLimiter");
require("dotenv").config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.options("/send-email", (0, cors_1.default)(corsOptions_1.corsOptions));
app.post("/send-email", rateLimiter_1.limiter, async (req, res) => {
    const { name, email, service, message } = req.body;
    console.log(req.body);
    const transporter = nodemailer_1.default.createTransport({
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
        from: process.env.GMAIL_USER,
        to: "tuhmaduuqba@gmail.com",
        subject: "New Submission",
        text: `
      Name/Organization: ${name}
      Email: ${email}
      Service: ${service}
      Message: ${message}
    `,
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Email sent successfully", info });
    }
    catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Failed to send email" });
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
