import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

import { config } from "dotenv";
config();

const transporter: Transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export default transporter;
