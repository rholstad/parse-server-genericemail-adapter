var nodemailer = require('nodemailer');

module.exports = function (options) {

    var transporter = nodemailer.createTransport({
        service: options.service,
        auth: {
            user: options.email, // Your email id
            pass: options.password // Your password }
        }
    });

    var sendMail = function (mail) {

        return new Promise(function (resolve, reject) {

            var mailOptions = {
                from: options.from, // sender address
                to: [mail.to], // list of receivers
                subject: mail.subject, // Subject line
                text: mail.text, //, // plaintext body
                html:mail.html,
                attachments:mail.attachments
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    console.log('Message sent: ' + info.response);
                    resolve(info);
                };
            });


        });
    };

    var sendPasswordResetEmail = function ({link, user, appName}) {
        const html =
        'Hi,' +
        '<br><br>' +
        'You requested to reset your password for ' +
        appName +
        (user.get('username')
            ? " (your username is '" + user.get('username') + "')"
            : '') +
        '.' +
        '<br><br>' +
        'Click <a href="' + link + '">here</a> to reset it.' +
        '<br><br>' +
        '-The Scout Hub Team';
        const to = user.get('email') || user.get('username');
        const subject = 'Password Reset for ' + appName;
        sendMail({ html, to, subject });
    }

    var sendVerificationEmail = function ({link, user, appName}) {
        const html =
        'Hi,\n\n' +
        'You are being asked to confirm the e-mail address ' +
        user.get('email') +
        ' with ' +
        appName +
        '\n\n' +
        '' +
        'Click <a href="' + link + '">here</a> to confirm it.' +
        '<br><br>' +
        '-The Scout Hub Team';
        const to = user.get('email') || user.get('username');
        const subject = 'Please verify your e-mail for ' + appName;
        sendMail({ html, to, subject });
    }


    return {
        sendMail: sendMail,
        sendPasswordResetEmail: sendPasswordResetEmail,
        sendVerificationEmail: sendVerificationEmail
    }
};

