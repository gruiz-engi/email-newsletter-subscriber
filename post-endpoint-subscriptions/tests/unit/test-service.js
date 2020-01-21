'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require("sinon");
var proxyquire = require("proxyquire");
proxyquire = proxyquire.noCallThru().noPreserveCache();
const SchemaValidator = require('../../services/utils/SchemaValidator');
const validator = new SchemaValidator();

describe('Tests NotificationService Service', function () {
    it('verifies NotificationService publishSubscription method success with all params', async () => {
        var publishMessageFake = sinon.fake.returns({
            MessageId: "Msg-001"
        });
        function NotificationStore() {
            this.publishMessage = publishMessageFake
        };
        var checkValidityFake = sinon.fake();
        function SchemaValidator() {
            this.checkValidity = checkValidityFake
        };
        var NotificationService = proxyquire('../../services/NotificationService', {
            "../repositories/NotificationStore": NotificationStore,
            "./utils/SchemaValidator": SchemaValidator
        });

        const params = {
            topic: 'App-001',
            payload: {
                Address: "test@email.com",
                Attributes: {
                    MonthlyNlOptStatus: "OptIn",
                    OptStatusLastChanged: "2019-05-15T10:05:59.064Z",
                    OptSource: "unit_test"
                }
            }
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
        expect(checkValidityFake.calledOnceWith(params.payload)).to.be.true;
    });

    it('verifies NotificationService publishSubscription method verifies missing topic param', async () => {
        var publishMessageFake = sinon.fake.returns({
            MessageResponse: {
                ApplicationId: "App-001",
                EndpointResult: {}
            }
        });
        function NotificationStore() {
            this.publishMessage = publishMessageFake
        };
        var checkValidityFake = sinon.fake();
        function SchemaValidator() {
            this.checkValidity = checkValidityFake
        };
        var NotificationService = proxyquire('../../services/NotificationService', {
            "../repositories/NotificationStore": NotificationStore,
            "./utils/SchemaValidator": SchemaValidator
        });

        const params = {
            //topic: 'App-001',
            payload: {
                Address: "test@email.com",
                Attributes: {
                    MonthlyNlOptStatus: "OptIn",
                    OptStatusLastChanged: "2019-05-15T10:05:59.064Z",
                    OptSource: "unit_test"
                }
            }
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

    it('verifies NotificationService publishSubscription method verifies missing payload param', async () => {
        var publishMessageFake = sinon.fake.returns({
            MessageResponse: {
                ApplicationId: "App-001",
                EndpointResult: {}
            }
        });
        function NotificationStore() {
            this.publishMessage = publishMessageFake
        };
        var checkValidityFake = sinon.fake();
        function SchemaValidator() {
            this.checkValidity = checkValidityFake
        };
        var NotificationService = proxyquire('../../services/NotificationService', {
            "../repositories/NotificationStore": NotificationStore,
            "./utils/SchemaValidator": SchemaValidator
        });

        const params = {
            topic: 'App-001',
            payload: null
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

describe('Tests Services Utils', function () {
    it('verifies model schema validator success only required fields', () => {
        const target = {
            Address: "test@email.com",
            Attributes: {
                MonthlyNlOptStatus: "OptIn",
                OptStatusLastChanged: "2019-05-15T10:05:59.064Z",
                OptSource: "unit_test"
            }
        };
        
        expect(validator.checkValidity(target)).to.not.throw;
    });

    it('verifies model schema validator success including not required fields', () => {
        const target = {
            Address: "test@email.com",
            Attributes: {
                MonthlyNlOptStatus: "OptIn",
                OptStatusLastChanged: "2019-05-15T10:05:59.064Z",
                OptSource: "unit_test"
            },
            User: {
                Attributes: {
                    Firstname: "Juan",
                    Lastname: "Del Pueblo"
                }
            }
        };
        
        expect(validator.checkValidity(target)).to.not.throw;
    });

    it('verifies model schema validator fails missing address field', () => {
        const target = {
            //Address: "test@email.com",
            Attributes: {
                MonthlyNlOptStatus: "OptIn",
                OptStatusLastChanged: "2019-05-15T10:05:59.064Z",
                OptSource: "unit_test"
            }
        };
        var error = null;
        try {
            validator.checkValidity(target);
        }
        catch(err) {
            error = err;
        }
        
        expect(error).to.not.be.null;
        expect(error).to.have.property('name', 'BadRequestException');
        expect(error).to.have.property('message', 'Address is required.');
    });

    it('verifies model schema validator fails missing attributes field', () => {
        const target = {
            Address: "test@email.com",
            /*Attributes: {
                MonthlyNlOptStatus: "OptIn",
                OptStatusLastChanged: "2019-05-15T10:05:59.064Z",
                OptSource: "unit_test"
            }*/
        };
        var error = null;
        try {
            validator.checkValidity(target);
        }
        catch(err) {
            error = err;
        }
        
        expect(error).to.not.be.null;
        expect(error).to.have.property('name', 'MultipleValidationErrors');
        expect(error).to.have.property('message', 'Attributes is required. Attributes.OptStatusLastChanged is required. Attributes.OptSource is required. ');
    });

    it('verifies model schema validator strips additional fields', () => {
        const target = {
            Address: "test@email.com",
            Attributes: {
                MonthlyNlOptStatus: "OptIn",
                OptStatusLastChanged: "2019-05-15T10:05:59.064Z",
                OptSource: "unit_test"
            },
            NonExistent: "YOLO"
        };
        var error = null;
        try {
            validator.checkValidity(target);
        }
        catch(err) {
            error = err;
        }
        expect(error).to.be.null;
        expect(target).to.not.have.property('NonExistent');
        expect(target).to.have.property('Address');
        expect(target).to.have.property('Attributes');
    });
});