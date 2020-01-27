'use strict';
const EngagementStore = require('../repositories/EngagementStore');

module.exports = class SubscriptionService {
    constructor() {
        this.store = new EngagementStore(); 
    }

    /**
     * 
     * @param {String} projectId
     * @param {String} endpointId
     * @param {Object} params 
     * @param {Object} params.User
     * @param {Object} params.User.Attributes
     * @param {String} params.Address
     * @param {Object} params.Attributes 
     * @param {String} params.Attributes.MonthlyNlOptStatus
     * @param {String} params.Attributes.OptStatusLastChanged
     * @param {String} params.Attributes.OptSource
     */
    async emailSubscription(projectId, params) {
        if(!projectId || !params.Address || !params.Attributes) {
            let error = new Error("Missing required field");
            error.name = "RequiredFieldError";
            throw error;
        }
        let email = params.Address;
        params.Attributes = this._mapAttributes(params.Attributes);
        if(params.User && params.User.Attributes) params.User.Attributes = this._mapAttributes(params.User.Attributes);
        params.ChannelType = 'EMAIL';
        params.OptOut = 'NONE';

        let result = null;
        result = await this.store.updateEndpoint(projectId, email, email, params);
        return result;
    }

    _mapAttributes(attributes) {
        if(!attributes) return attributes;
        let result = {}
        Object.keys(attributes).forEach((value) => {
            if(typeof attributes[value] === 'string') {
                result[value] = [
                    attributes[value]
                ];
            }
            else if(Array.isArray(attributes[value])) {
                result[value] = attributes[value];
            }
        });
        return result;
    }
}