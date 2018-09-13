/**
 * Module name: node-emailer
 * Version: v1.0.0
 * Description: Node emailer allows you to send HTML based emails with or without attachments.
 * License: MIT
 * Git: https://github.com/rudrakshpathak/node-emailer.git
 * Dependencies: async, nodemailer, promise
 */

var emailTransporter = require('nodemailer');
var configurations = require('./config');

/**
 * Emailer class to send HTML based emails with attachments
 */
class Emailer {

    /**
     * Initializing emailer properties
     */
    constructor() {
        // Initializing email transporter
        this.transporterConfig = null;

        // Initialiing email configurations
        this.mailOptions = {};
    }

    /**
     * Sending HTML content email with or without attachments
     * @param {object} emailData Email content
     */
    sendMail(emailData) {
        try {
            // Validating email data
            let _validationResult = this.validateEmailData(emailData);

            // If validation is successfull, sending the mail
            if (_validationResult.result) {
                this.mailOptions.to = (emailData.to != undefined) ? emailData.to : "";
                this.mailOptions.from = (emailData.emailConfig.emailFrom != undefined) ? emailData.emailConfig.emailFrom : "";
                this.mailOptions.subject = (emailData.subject != undefined) ? emailData.subject : "";
                this.mailOptions.html = (emailData.content != undefined) ? emailData.content : "";
                this.transporterConfig = emailData.emailConfig.transporterConfig;

                // Creating email transporter
                this.transporter = emailTransporter.createTransport(this.transporterConfig);

                // Checking if attachment exists
                if (emailData.attachments != undefined && emailData.attachments != null && emailData.attachments != "") {
                    // Attaching all attachments in email configuraiton
                    this.mailOptions.attachments = emailData.attachments;

                    // Reading files for attachments
                    this.readFiles(emailData.attachments).then(() => {
                        this.transporter.sendMail(this.mailOptions, function (error, info) {
                            return (error) ? false : true;
                        });
                    });
                } else {
                    // Seding non-attachment email
                    this.transporter.sendMail(this.mailOptions, function (error, info) {
                        return (error) ? false : true;
                    });
                }
            } else {
                return _validationResult.message;
            }
        } catch (exception) {
            console.warn(exception);
        }
    }

    /**
     * Validating email data for errors
     * @param {object} emailData Email data
     */
    validateEmailData(emailData) {
        try {
            if (emailData.emailConfig.transporterConfig == undefined || emailData.emailConfig.transporterConfig == "") {
                return {
                    result: false,
                    message: configurations.EMAIL_CONFIGURATION_MISSING
                };
            } else if (emailData.to == undefined || (emailData.to).trim() == "") {
                return {
                    result: false,
                    message: configurations.EMAIL_TO_MISSING
                };
            } else if (!this.validateEmailFormat(emailData.to)) {
                return {
                    result: false,
                    message: configurations.INVALID_TO_EMAIL
                };
            } else if (emailData.emailConfig.emailFrom == undefined || (emailData.emailConfig.emailFrom).trim() == "") {
                return {
                    result: false,
                    message: configurations.EMAIL_FROM_MISSING
                };
            } else if (!this.validateEmailFormat(emailData.emailConfig.emailFrom)) {
                return {
                    result: false,
                    message: configurations.INVALID_FROM_EMAIL
                };
            } else if (emailData.subject == undefined || (emailData.subject).trim() == "") {
                return {
                    result: false,
                    message: configurations.EMAIL_SUBJECT_MISSING
                };
            } else if (emailData.attachments != undefined && emailData.attachments != "" && this.validateFileExtension(emailData.attachments)) {
                return {
                    result: false,
                    message: configurations.INVALID_EXTENSION
                };
            } else {
                return {
                    result: true
                };
            }
        } catch (exception) {
            console.warn(exception);
        }
    }

    /**
     * Validating file extension for malicious files
     * @param {array} attachmentArray Attachment data
     */
    validateFileExtension(attachmentArray) {
        try {
            let _isInValidExtension = null;
            attachmentArray.forEach((value) => {
                let _fileExtension = value.path.split('.').pop().toLowerCase();
                _isInValidExtension = configurations.RESTRICTED_EXTENSIONS.indexOf(_fileExtension) > -1;

            });

            return (_isInValidExtension) ? true : false;
        } catch(exception) {
            console.warn(exception);
        }
    }

    /**
     * Validate email format
     * @param {string} email Email string
     */
    validateEmailFormat(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    /**
     * Reading files to be send as attachment
     * @param {array} attachmentArray Attachcment array
     */
    readFiles(attachmentArray) {
        try {
            return new Promise((resolve, reject) => {
                attachmentArray.forEach((value) => {
                    // Pushing file configurations in object
                    this.mailOptions.attachments.push(value);
                });
                resolve();
            });
        } catch (exception) {
            console.warn(exception);
        }
    }
}

// Exporting modules to be used in files
module.exports = new Emailer();