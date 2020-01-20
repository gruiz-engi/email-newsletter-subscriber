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
     * @param {Object} input.User
     * @param {Object} input.User.Attributes
     * @param {String} input.Address
     * @param {Object} input.Attributes 
     * @param {String} input.Attributes.MonthlyNlOptStatus
     * @param {String} input.Attributes.OptStatusLastChanged
     * @param {String} input.Attributes.OptSource
     * @param {String} input.Demographic
     */
    async handleEmailSubscription(projectId, input) {
        if(!projectId) {
            this.logger.log("Required enviromental variables for configuration not set correctly.");
            let error = Error("Internal server error");
            error.name = "InternalServerError";
            throw error;
        } 

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