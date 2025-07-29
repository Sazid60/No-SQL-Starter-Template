/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from "nodemailer"
import { envVars } from '../config/env';
import path from "path"
import ejs from "ejs"
import AppError from "../errorHelpers/AppError";
const transporter = nodemailer.createTransport({
    secure: true,
    auth: {
        user: envVars.EMAIL_SENDER.SMTP_USER,
        pass: envVars.EMAIL_SENDER.SMTP_PASS,
    },
    port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
    host: envVars.EMAIL_SENDER.SMTP_HOST,
})

interface sendEmailOptions {
    to: string,
    subject: string,
    templateName: string, //html templateName
    templateData?: Record<string, any>, // html template data which will be object 
    attachments?: {
        filename: string,
        content: Buffer | string,
        contentType: string
    }[]
}

export const sendEmail = async ({ to, subject, attachments, templateName, templateData }: sendEmailOptions) => {

    try {
        const templatePath = path.join(__dirname, `templates/${templateName}.ejs`)
        console.log(templatePath)

        const html = await ejs.renderFile(templatePath, templateData)

        const info = await transporter.sendMail({
            from: envVars.EMAIL_SENDER.SMTP_FROM,
            to: to,
            subject: subject,
            html: html, // we will make the template using ejs package 
            attachments: attachments?.map(attachment => (
                {
                    filename: attachment.filename,
                    content: attachment.content,
                    contentType: attachment.contentType
                }
            ))
        })

        console.log(`\u2709\uFE0F Email sent to ${to}: ${info.messageId}`);
    } catch (error: any) {
        console.log("email sending error", error.message);
        throw new AppError(401, "Email error")

    }
}