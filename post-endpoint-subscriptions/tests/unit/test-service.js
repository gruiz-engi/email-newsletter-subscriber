'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require("sinon");
var proxyquire = require("proxyquire");
proxyquire = proxyquire.noCallThru().noPreserveCache();

describe('Tests NotificationService Service', function () {
    it('verifies NotificationService publishSubscription method success with all params', async () => {
        var publishMessageFake = sinon.fake.returns({
            MessageId: "Msg-001"
        });
        function NotificationStore() {
            this.publishMessage = publishMessageFake
        };
        var NotificationService = proxyquire('../../services/NotificationService', {
            "../repositories/NotificationStore": NotificationStore
        });

        const params = {
            topic: 'App-001',
            payload: {key: 'value'}
        };

        const service = new NotificationService();
        var result = null;
        var error = null;
        try {
            result = await service.publishSubscription(params);
        }
        catch(err) {
            error = err;
        }
        expect(error).to.be.a('null');
        expect(result).to.be.an('object');
        expect(result).to.have.property('MessageId').and.to.be.an('string');
        expect(publishMessageFake.calledOnceWith(params.topic, JSON.stringify(params.payload))).to.be.true;
    });

    it('verifies NotificationService publishSubscription method verifies missing projectId param', async () => {
        var publishMessageFake = sinon.fake.returns({
            MessageResponse: {
                ApplicationId: "App-001",
                EndpointResult: {}
            }
        });
        function NotificationStore() {
            this.publishMessage = publishMessageFake
        };
        var NotificationService = proxyquire('../../services/NotificationService', {
            "../repositories/NotificationStore": NotificationStore
        });

        const params = {
            //topic: 'App-001',
            payload: {key: 'value'}
        };

        const service = new NotificationService();
        var result = null;
        var error = null;
        try {
            result = await service.publishSubscription(params);
        }
        catch(err) {
            error = err;
        }
        expect(error).to.not.be.a('null');
        expect(result).to.be.a('null');
        expect(error).to.have.property('name').and.to.be.equal('RequiredFieldError');
    });
});