'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require("sinon");
var proxyquire = require("proxyquire");
proxyquire = proxyquire.noCallThru().noPreserveCache();

describe('Tests Controller', function () {
    it('verifies handleSubscriptionGreetings method returns data successfully', async () => {
        var subscribedGreetingsFake = sinon.fake.returns({ Id: "End-001" });
        var logFake = sinon.fake();
        var logErrorFake = sinon.fake();
        function LoggerService() {
            this.log = logFake,
            this.logError = logErrorFake
        };
        function EmailService() {
            this.subscribedGreetings = subscribedGreetingsFake
        };
        var Controller = proxyquire('../../Controller', {
            "./services/LoggerService": LoggerService,
            "./services/EmailService": EmailService
        });

        const input = {
            templateName: "test-template",
            endpoint: {
                User: {
                    Attributes: {
                        Firstname: "Guillermo",
                        Lastname: "Ruiz",
                        Interests: [
                            "Node.js"
                        ]
                    }
                },
                Address: "test@email.com",
                Attributes: {
                    MonthlyNlOptStatus: "OptIn",
                    OptStatusLastChanged: "2019-05-15T10:05:59.064Z",
                    OptSource: "unit_test"
                },
                Demographic: {
                    Timezone: 'America/Puerto_Rico'
                }
            }
        };

        let controller = new Controller();
        var result = null;
        var error = null;
        try {
            result = await controller.handleSubscriptionGreetings("Proj-001", input);
        }
        catch(err) {
            error = err;
        }
        expect(error).to.be.a('null');
        expect(controller.logger.log.calledOnce).to.be.equal(false);
        expect(result).to.be.an('object').and.to.have.property('Id').and.to.be.an('string');
        expect(subscribedGreetingsFake.calledOnceWith({
            appId: "Proj-001",
            ...input
        })).to.be.true;
    });

    it('verifies handleSubscriptionGreetings method calls logger service logError method and throws error', async () => {
        var e = new Error("Test Error");
        e.name = "TestError";
        var subscribedGreetingsFake = sinon.fake.throws(e);
        var logFake = sinon.fake();
        var logErrorFake = sinon.fake();
        function LoggerService() {
            this.log = logFake,
            this.logError = logErrorFake
        };
        function EmailService() {
            this.subscribedGreetings = subscribedGreetingsFake
        };
        var Controller = proxyquire('../../Controller', {
            "./services/LoggerService": LoggerService,
            "./services/EmailService": EmailService
        });

        const input = {
            templateName: "test-template",
            endpoint: {
                User: {
                    Attributes: {
                        Firstname: "Guillermo",
                        Lastname: "Ruiz",
                        Interests: [
                            "Node.js"
                        ]
                    }
                },
                Address: "test@email.com",
                Attributes: {
                    MonthlyNlOptStatus: "OptIn",
                    OptStatusLastChanged: "2019-05-15T10:05:59.064Z",
                    OptSource: "unit_test"
                },
                Demographic: {
                    Timezone: 'America/Puerto_Rico'
                }
            }
        };

        let controller = new Controller();
        var result = null;
        var error = null;
        try {
            result = await controller.handleSubscriptionGreetings("Proj-001", input);
        }
        catch(err) {
            error = err;
        }
        expect(result).to.be.a('null');
        expect(error).to.be.an('Error').and.to.have.property('name').and.to.be.equal('TestError');
        expect(logFake.called).to.be.false;
        expect(logErrorFake.called).to.be.true;
        expect(subscribedGreetingsFake.calledOnceWith({
            appId: "Proj-001",
            ...input
        })).to.be.true;
    });
});