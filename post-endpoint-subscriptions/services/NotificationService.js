'use strict';
const NotificationStore = require('../repositories/NotificationStore');
const SchemaValidator = require('./utils/SchemaValidator');

module.exports = class NotificationService {
    constructor() {
        this.store = new NotificationStore(); 
        this.validator = new SchemaValidator();
    }

    /**
     * 
     * @param {Object} params 
     * @param {String} params.topic
     * @param {Object} params.payload
     * @param {Object} params.User
     * @param {Object} params.User.Attributes
     * @param {String} params.Address
     * @param {Object} params.Attributes 
     * @param {String} params.Attributes.MonthlyNlOptStatus
     * @param {String} params.Attributes.OptStatusLastChanged
     * @param {String} params.Attributes.OptSource
     * @param {String} params.Demographic
     */
    async publishSubscription(params) {
        const { topic, payload } = params;
        if(!topic || !payload) {
            let error = new Error("Missing required field");
            error.name = "RequiredFieldError";
            throw error;
        }
        this.validator.checkValidity(payload);
        return this.store.publishMessage(topic, JSON.stringify(payload));
    }
}