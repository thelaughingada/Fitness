// @ts-check
/*jshint esversion: 6 */
var Calc = require("./calc");
var calc = new Calc();
var Config = require("./Config");
var config = new Config();
var nodemailer = require('nodemailer');
var Log = require("./Log");
var logFile = new Log();

class EmailManager {
    constructor() {
        if (!config.PROXY_MODE) {
            this.transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.GAGS_USERNAME,
                    pass: process.env.GAGS_PASSWORD
                }
            });
        }
        else {
            logFile.log('Email service not started - PROXY MODE ACTIVE', false, 1);
        }
    }

    sendEmail(toEmail, subject, text) {
        if (config.PROXY_MODE) {
            logFile.log('Email to ' + toEmail + ' NOT SENT - PROXY MODE ACTIVE', false, 1);
            return;
        }
        var mailOptions = {
            from: this.transporter.options.auth.user,
            to: toEmail,
            subject: subject,
            text: text
        };

        this.transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                logFile.log(error, false, 2);
            } else {
                logFile.log('Email sent: ' + info.response, false, 2);
            }
        });
    }
}

module.exports = EmailManager;
