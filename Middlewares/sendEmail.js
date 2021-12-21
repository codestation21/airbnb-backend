const nodemailer = require("nodemailer");

module.exports.sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "f1cca267d908ae",
            pass: "546752b1e1ad91"
        }
    });
    await transporter.sendMail({
        from: 'noreply@airbnb.com',
        to: options.email,
        subject: options.subject,
        html: options.html,
    });
};