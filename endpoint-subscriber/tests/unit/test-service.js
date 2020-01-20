'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require("sinon");
var proxyquire = require("proxyquire");
proxyquire = proxyquire.noCallThru().noPreserveCache();

describe('Tests SubscriptionService Repository', function () {
    it('verifies SubscriptionService _mapAttributes helper method success', async () => {
        var SubscriptionService = proxyquire('../../services/SubscriptionService', {});

        const service = new SubscriptionService();
        var result = null;
        var error = null;
        try {
            result = await service._mapAttributes({
                firstname: "Guillermo",
                lastname: "Ruiz",
                interests: [
                    "Node.js"
                ]
            });
        }
        catch(err) {
            error = err;
        }
        expect(error).to.be.a('null');
        expect(result).to.be.an('object');
        expect(result.firstname).to.be.an('Array');
        expect(result.lastname).to.be.an('Array');
        expect(result.interests).to.be.an('Array');
    });

    it('verifies SubscriptionService emailSubscription method success with all params', async () => {
        var updateEndpointFake = sinon.fake.returns({
            MessageBody: {
                Message: "OK",
                RequestID: "Req-001"
            }
        });
        function EngagementStore() {
            this.updateEndpoint = updateEndpointFake
        };
        var SubscriptionService = proxyquire('../../services/SubscriptionService', {
            "../repositories/EngagementStore": EngagementStore
        });

        const endpoint = {
            User: {
                Attributes: {
                    Firstname: "Guillermo",
                    Lastname: "Ruiz",
                    Email: "test@email.com"
                }
            },
            Address: "test@email.com",
            Attributes: {
                LatestsNlOptStatus: "OptIn",
                OptStatusLastChanged: "2019-05-15T10:05:59.064Z",
                OptSource: "unit_test"
            },
            Demographic: {
                Timezone: 'America/Puerto_Rico'
            }
        };

        const service = new SubscriptionService();
        var result = null;
        var error = null;
        try {
            result = await service.emailSubscription('Proj-001', endpoint);
        }
        catch(err) {
            error = err;
        }
        expect(error).to.be.a('null');
        expect(result).to.be.an('object');
        expect(result.MessageBody).to.have.property('RequestID').and.to.be.equal('Req-001');
        expect(updateEndpointFake.calledOnceWith("Proj-001", endpoint.Address, endpoint.Address, endpoint)).to.be.true;
    });

    it('verifies SubscriptionService emailSubscription method verifies missing projectId param', async () => {
        var updateEndpointFake = sinon.fake.returns({
            MessageBody: {
                Message: "OK",
                RequestID: "Req-001"
            }
        });
        function EngagementStore() {
            this.updateEndpoint = updateEndpointFake
        };
        var SubscriptionService = proxyquire('../../services/SubscriptionService', {
            "../repositories/EngagementStore": EngagementStore
        });

        const endpoint = {
            User: {
                Attributes: {
                    Firstname: "Guillermo",
                    Lastname: "Ruiz",
                    Email: "test@email.com"
                }
            },
            Address: "test@email.com",
            Attributes: {
                LatestsNlOptStatus: "OptIn",
                OptStatusLastChanged: "2019-05-15T10:05:59.064Z",
                OptSource: "unit_test"
            },
            Demographic: {
                Timezone: 'America/Puerto_Rico'
            }
        };

        const service = new SubscriptionService();
        var result = null;
        var error = null;
        try {
            result = await service.emailSubscription(null, endpoint);
        }
        catch(err) {
            error = err;
        }
        expect(error).to.not.be.a('null');
        expect(result).to.be.a('null');
        expect(error).to.have.property('name').and.to.be.equal('RequiredFieldError');
    });

    it('verifies SubscriptionService emailSubscription method verifies missing address param', async () => {
        var updateEndpointFake = sinon.fake.returns({
            MessageBody: {
                Message: "OK",
                RequestID: "Req-001"
            }
        });
        function EngagementStore() {
            this.updateEndpoint = updateEndpointFake
        };
        var SubscriptionService = proxyquire('../../services/SubscriptionService', {
            "../repositories/EngagementStore": EngagementStore
        });

        const endpoint = {
            User: {
                Attributes: {
                    Firstname: "Guillermo",
                    Lastname: "Ruiz",
                    Email: "test@email.com"
                }
            },
            //Address: "test@email.com",
            Attributes: {
                LatestsNlOptStatus: "OptIn",
                OptStatusLastChanged: "2019-05-15T10:05:59.064Z",
                OptSource: "unit_test"
            },
            Demographic: {
                Timezone: 'America/Puerto_Rico'
            }
        };

        const service = new SubscriptionService();
        var result = null;
        var error = null;
        try {
            result = await service.emailSubscription("Proj-001", endpoint);
        }
        catch(err) {
            error = err;
        }
        expect(error).to.not.be.a('null');
        expect(result).to.be.a('null');
        expect(error).to.have.property('name').and.to.be.equal('RequiredFieldError');
    });
});