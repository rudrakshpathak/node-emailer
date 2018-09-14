# Node Emailer
Node emailer allows you to send HTML based emails with or without attachments.

You can visit npm for more info on [node-email-sender package](https://www.npmjs.com/package/node-email-sender)

[![version](https://img.shields.io/badge/version-v1.0.0-orange.svg)]()
[![npm](https://img.shields.io/badge/node-v6.9.4-blue.svg)]()
[![npm](https://img.shields.io/npm/l/express.svg)]()
[![PyPI](https://img.shields.io/badge/status-stable-brightgreen.svg)]()

### To use the package in your app
Run `npm install node-email-sender`

### Import Package
Import this package where you want to use Email service.
```javascript
var emailer = require('node-email-sender');
```

### Creating email configuration
Save this configuration in your existing configuration file or create a new one. Use this configuration in the file from which you want to send mail and simply pass the object in the mail function as a parameter.
```javascript
emailConfig = {
    emailFrom: 'EMAIL_FROM_ID', (MANDATORY)
    transporterConfig: {
        service: 'SERVICE_PROVIDER', (MANDATORY)
        auth: {
            user: 'EMAIL_ACCOUNT', (MANDATORY)
            pass: 'EMAIL_PASSWORD' (MANDATORY)
        },
        port: 'EMAIL_POST', (OPTIONAL) | (Default: 587 for unsecured and 465 for secured connection)
        host: 'HOST_OR_IP_NAME', (OPTIONAL) | (Default: localhost)
        secure: 'EMAIL_SECURITY', (OPTIONAL) | (Default: false)
        tls: 'SECURE_SOCKET_CONSTRUCTOR', (OPTIONAL) | (Default: false)
    }
}
```

### Using the Node Emailer
Use this code snippet to call the emailer class function.
```javascript
let response = emailer.sendMail({
    emailConfig: 'EMAIL_SERVER_AND_CONFIGURATION', (MANDATORY) | (Configuration need to be saved and imported)
    to: 'TO_EMAIL', (MANDATORY)
    subject: 'EMAIL_SUBJECT', (MANDATORY)
    content: 'EMAIL_CONTENT', (MANDATORY)
    attachments: '[ATTACHMENT ARRAY]' (OPTIONAL) | FORMAT - {filename:'file.txt', path:'/path/to/file.txt'}
});
```

### Sample code to run
```javascript
var sendMail = require('node-email-sender');

let emailConfig = {
    emailFrom: 'dummyemail@mailinator.com',
    transporterConfig: {
        service: 'gmail',
        auth: {
            user: 'dummyemail@mailinator.com',
            pass: 'sample-password'
        }
    }
}

var response = sendMail.sendMail({
    emailConfig: emailConfig,
    to: 'dummyemail2@mailinator.com',
    subject: 'Sample subject',
    content: 'Sample content',
});

console.log(response);
```