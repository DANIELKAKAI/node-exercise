const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/send-sms', (req, res) => {

    const { phoneNumber, message } = req.body;

    const url = 'https://api.vaspro.co.ke/v3/BulkSMS/api/create';

    const data = {
        "apiKey": process.env.API_KEY || "2c903209817b8098182eab4a5b905c4c",
        "shortCode": "VasPro",
        "message": message,
        "recipient": phoneNumber,
        "callbackURL": "https://typedwebhook.tools/webhook/a76186cd-553b-417b-a927-40cf5f34b418",
        "enqueue": 0
    };

    axios.post(url, data)
        .then(response => {
            res.status(200).json(response.data);
        })
        .catch(error => {
            res.status(500).json({ error: 'An error occurred' });
        });

});

app.post('/send-email', (req, res) => {

    const { email, message } = req.body;

    const emailParams = {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'daniel.kimassai@gmail.com',
            pass: process.env.EMAIL_PASSWORD
        }
    };

    const emailOptions = {
        from: 'Daniel <daniel.kimassai@gmail.com>',
        to: email,
        subject: 'Hello ✔',
        text: message,
        html: `<b>${message}</b>`
    };

    const transporter = nodemailer.createTransport(emailParams);

    transporter.sendMail(emailOptions)
        .then(info => {
            console.log('Email sent:', info.messageId);
            res.json({ message: 'Email sent' });
        })
        .catch(error => {
            console.error('Error sending email:', error);
            res.status(500).json({ error: 'Failed to send email' });
        });
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});

