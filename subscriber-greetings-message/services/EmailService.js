'use strict';
const EmailStore = require('../repositories/EmailStore');

module.exports = class EmailService {
    constructor() {
        this.store = new EmailStore(); 
    }

    /**
     * 
     * @param {Object} params 
     * @param {String} params.appId
     * @param {String} params.templateName - Template name
     * @param {Object} params.endpoint
     */
    async subscribedGreetings(params) {
        const { appId, templateName, endpoint } = params;
        if(!appId || !templateName || !endpoint) {
            let error = new Error("Missing required field");
            error.name = "RequiredFieldError";
            throw error;
        }
        const { Address, User, Attributes } = endpoint;
        return this.store.sendEmail(appId, [ Address ], {
            template: {
                name: templateName,
                data: {}
            }
        })
    }
}