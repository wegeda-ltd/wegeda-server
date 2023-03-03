import nodeMailer from "nodemailer"
import { config } from "dotenv";
import { ServerError } from "../errors";

config()

interface MailProps {
    message: string;
    email: string;
    subject: string;
}


if (!process.env.MAIL_USER) {
    throw new Error('MAIL_USER must be defined')
}
if (!process.env.MAIL_PASSWORD) {
    throw new Error('MAIL_PASSWORD must be defined')

}
const transporter = nodeMailer.createTransport({
    host: "smtp.zoho.com",
    secure: true,
    port: 465,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
})

export const sendMail = async ({ message, email, subject }: MailProps) => {
    try {
        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: subject,
            html: message
        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (info) {
                return info
            }
            if (error) {
                throw new ServerError()
            }
        })
    } catch (error) {
        throw new ServerError()
    }
}