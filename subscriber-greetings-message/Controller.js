'use strict';
const EmailService = require('./services/EmailService');
const LoggerService = require('./services/LoggerService');

module.exports = class Controller {
    constructor() {
        this.service = new EmailService();
        this.logger = new LoggerService();
    }

    /**
     * 
     * @param {String} appId
     * @param {Object} input
     * @param {String} input.templateName
     * @param {Object} input.endpoint
     */
    async handleSubscriptionGreetings(appId, input) {
        if(!appId) {
            this.logger.log("Required enviromental variables for configuration not set correctly.");
            let error = Error("Internal server error");
            error.name = "InternalServerError";
            throw error;
        } 

        try {
            let result = await this.service.subscribedGreetings({
                appId,
                ...input
            });
            return result;
        }
        catch(err) {
            this.logger.logError(err);
            throw err;
        }
    }
}