'use strict';
const SubscriptionService = require('./services/SubscriptionService');
const LoggerService = require('./services/LoggerService');

module.exports = class Controller {
    constructor() {
        this.service = new SubscriptionService();
        this.logger = new LoggerService();
    }

    /**
     * 
     * @param {String} projectId
     * @param {Object} input
     */
    async handleEmailSubscription(projectId, input) {
        try {
            let result = await this.service.emailSubscription(projectId, input);
            return result;
        }
        catch(err) {
            this.logger.logError(err);
            throw err;
        }
    }
}