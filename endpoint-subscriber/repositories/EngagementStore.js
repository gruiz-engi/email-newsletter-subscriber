'use strict';
const AWS = require('aws-sdk');

module.exports = class EngagementStore {
    constructor() {
        this.pinpoint = new AWS.Pinpoint(); 
    }
    
    /**
     * 
     * @param {String} projectId
     * @param {String} userId
     * @param {String} endpointId
     * @param {Object} model 
     * @param {Object} model.User
     * @param {Object} model.User.Attributes
     * @param {String} model.Address
     * @param {Object} model.Attributes 
     * @param {Array<String>} model.Attributes.LatestsNlOptStatus
     * @param {Array<String>} model.Attributes.OptStatusLastChanged
     * @param {Array<String>} model.Attributes.OptSource
     * @param {String} model.ChannelType
     * @param {Object} model.Demographic
     * @param {String} model.Demographic.AppVersion
     * @param {String} model.Demographic.Locale
     * @param {String} model.Demographic.Make
     * @param {String} model.Demographic.Model
     * @param {String} model.Demographic.ModelVersion
     * @param {String} model.Demographic.Platform
     * @param {String} model.Demographic.PlatformVersion
     * @param {String} model.Demographic.Timezone
     * @param {String} model.UpdatedOn
     * @param {Object} model.Location
     * @param {String} model.Location.City
     * @param {String} model.Location.Country
     * @param {Number} model.Location.Latitude
     * @param {Number} model.Location.Longitude
     * @param {String} model.Location.PostalCode
     * @param {String} model.Location.Region
     * @param {String} model.OptOut
     */
    async updateEndpoint(projectId, userId, endpointId, model) {
        const {
            User,
            Address,
            Attributes,
            Demographic,
            ChannelType,
            OptOut
        } = model;
        let userMap = {
            UserId: userId
        }
        if(User) userMap.UserAttributes = User.Attributes;
        var params = {
            ApplicationId: projectId,
            EndpointId: endpointId,
            EndpointRequest: {
                Address,
                Attributes,
                Demographic,
                ChannelType,
                EffectiveDate:  new Date().toISOString(),
                OptOut,
                User: userMap
            }
        };
        let result = await this.pinpoint.updateEndpoint(params).promise();
        return result;
    }
}