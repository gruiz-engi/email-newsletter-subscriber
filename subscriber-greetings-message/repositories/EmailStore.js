'use strict';
const AWS = require('aws-sdk');

module.exports = class EmailStore {
    constructor() {
        this.pinpoint = new AWS.Pinpoint(); 
    }
    
    /**
     * 
     * @param {String} appId
     * @param {Array<String>} to - List of email address destinations
     * @param {Object} options
     * @param {Object} options.template - Template configuration
     * @param {String} options.template.name - Name of the template to use
     * @param {Object} options.template.data - Map of data to replace variables on template. The key values should be array of strings.
     */
    async sendEmail(appId, to, options) {
        const addresses = this._convertAddresses(to);
        const params = {
            ApplicationId: appId,
            MessageRequest: {
                MessageConfiguration: {
                    EmailMessage: {
                        Body: 'This is a fallback body. Something went wrong with the template.',
                        Substitutions: options.template.data
                    }
                },
                Addresses: addresses,
                TemplateConfiguration: {
                    EmailTemplate: {
                        Name: options.template.name
                    }
                }
            }
        };
        return this.pinpoint.sendMessages(params).promise();
    }

    /**
     * 
     * @param {Array<String>} list
     */
    _convertAddresses(list) {
        return list.reduce((prev, current) => {
            prev[current] = {
                ChannelType: 'EMAIL',
            };
            return prev;
        }, {});
    }
}