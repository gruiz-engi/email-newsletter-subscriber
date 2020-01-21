'use strict';
const NotificationService = require('./services/NotificationService');
const LoggerService = require('./services/LoggerService');

module.exports = class Controller {
    constructor() {
        this.service = new NotificationService();
        this.logger = new LoggerService();
    }

    /**
     * 
     * @param {String} topic
     * @param {Object} input
     */
    async handleEmailSubscription(topic, input) {
        try {
            let result = await this.service.publishSubscription({
                topic, 
                payload: input
            });
            return result;
        }
        catch(err) {
            this.logger.logError(err);
            throw err;
        }
    }
}