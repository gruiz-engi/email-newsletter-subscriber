'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require("sinon");
var proxyquire = require("proxyquire");
proxyquire = proxyquire.noCallThru().noPreserveCache();

describe('Tests EmailService Service', function () {
    it('verifies EmailService subscribedGreetings method success with all params', async () => {
        var sendEmailFake = sinon.fake.returns({
            MessageResponse: {
                ApplicationId: "App-001",
                EndpointResult: {}
            }
        });
        function EmailStore() {
            this.sendEmail = sendEmailFake
        };
        var EmailService = proxyquire('../../services/EmailService', {
            "../repositories/EmailStore": EmailStore
        });

        const params = {
            appId: 'App-001',
            templateName: 'test-template',
            endpoint: {
                Address: 'to@email.com',
                User: {
                    Attributes: {}
                },
                Attributes: {}
            }
        };

        const service = new EmailService();
        var result = null;
        var error = null;
        try {
            result = await service.subscribedGreetings(params);
        }
        catch(err) {
            error = err;
        }
        expect(error).to.be.a('null');
        expect(result).to.be.an('object');
        expect(result).to.have.property('MessageResponse').and.to.be.an('object');
        expect(sendEmailFake.calledOnceWith(params.appId, [ params.endpoint.Address ], {
            template: {
                name: params.templateName,
                data: {}
            }
        })).to.be.true;
    });

    it('verifies EmailService subscribedGreetings method verifies missing projectId param', async () => {
        var sendEmailFake = sinon.fake.returns({
            MessageResponse: {
                ApplicationId: "App-001",
                EndpointResult: {}
            }
        });
        function EmailStore() {
            this.sendEmail = sendEmailFake
        };
        var EmailService = proxyquire('../../services/EmailService', {
            "../repositories/EmailStore": EmailStore
        });

        const params = {
            //appId: 'App-001',
            templateName: 'test-template',
            endpoint: {
                Address: 'to@email.com',
                User: {
                    Attributes: {}
                },
                Attributes: {}
            }
        };

        const service = new EmailService();
        var result = null;
        var error = null;
        try {
            result = await service.subscribedGreetings(params);
        }
        catch(err) {
            error = err;
        }
        expect(error).to.not.be.a('null');
        expect(result).to.be.a('null');
        expect(error).to.have.property('name').and.to.be.equal('RequiredFieldError');
    });
});