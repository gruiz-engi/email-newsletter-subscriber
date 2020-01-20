'use strict';
const AWS = require('aws-sdk');

module.exports = class NotificationStore {
    constructor() {
        this.sns = new AWS.SNS(); 
    }
    
    /**
     * 
     * @param {String} topic
     * @param {String} payload
     */
    async publishMessage(topic, payload) {
        const params = {
            TopicArn: topic,
            Message: payload
        };
        return this.sns.publish(params).promise();
    }
}