const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
service: 'gmail', // or use 'smtp.yourservice.com'
auth: {
user: process.env.EMAIL_USER,
pass: process.env.EMAIL_PASS,
},
});

const sendVerificationEmail = async (to, name,verificationToken) => {
const verificationLink = `${process.env.DOMAIN_URI}/api/marketplace/v1/verify?token=${verificationToken}`


    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Email Verification',
        text: 'Please Verify Your mail',

        html: `<h1>Email Confirmation</h1>
        <h2>Hello ${name}</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <a href=${verificationLink} >Click here</a>
        </div>`,
    };

return transporter.sendMail(mailOptions);
};

module.exports = sendVerificationEmail;