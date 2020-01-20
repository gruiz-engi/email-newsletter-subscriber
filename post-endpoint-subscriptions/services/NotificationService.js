'use strict';
const NotificationStore = require('../repositories/NotificationStore');

module.exports = class NotificationService {
    constructor() {
        this.store = new NotificationStore(); 
    }

    /**
     * 
     * @param {Object} params 
     * @param {String} params.topic
     * @param {Object} params.payload
     */
    async publishSubscription(params) {
        const { topic, payload } = params;
        if(!topic || !payload) {
            let error = new Error("Missing required field");
            error.name = "RequiredFieldError";
            throw error;
        }
        return this.store.publishMessage(topic, JSON.stringify(payload));
    }
}