'use strict';

const chai = require('chai');
const expect = chai.expect;
const AWS_MOCK = require('aws-sdk-mock');
const EmailStore = require('../../repositories/EmailStore');

describe('Tests EmailStore Repository', function () {
    before(function () {
        AWS_MOCK.mock('Pinpoint', 'sendMessages', function(params, callback) {
            callback(null, {
                MessageResponse: {
                    ApplicationId: params.ApplicationId,
                    EndpointResult: {}
                }
            });
        });
    });

    after(function () {
        AWS_MOCK.restore();
    });

    it('verifies EmailStore _convertAddresses method success', () => {
        const store = new EmailStore();
        var result = null;
        var error = null;
        try {
            result = store._convertAddresses([ "to@email.com" ]);
        }
        catch(err) {
            error = err;
        }
        expect(error).to.be.a('null');
        expect(result).to.be.an('object');
        expect(result).to.have.property('to@email.com').and.to.have.property('ChannelType', 'EMAIL');
    });

    it('verifies EmailStore sendEmail method success', async () => {
        const store = new EmailStore();
        var result = null;
        var error = null;
        try {
            result = await store.sendEmail('App-001', [ "to@email.com" ], 
            {
                template: {
                    name: 'test-template',
                    data: {
                        key: [ 'value' ]
                    }
                }
            });
        }
        catch(err) {
            error = err;
        }
        expect(error).to.be.a('null');
        expect(result).to.be.an('object');
        expect(result).to.have.property('MessageResponse');
    });

    it('verifies EmailStore sendEmail method throw error of missing required field', async () => {
        const store = new EmailStore();
        var result = null;
        var error = null;
        try {
            result = await store.sendEmail(null, [ "to@email.com" ], 
            {
                template: {
                    name: 'test-template',
                    data: {
                        key: 'value'
                    }
                }
            });
        }
        catch(err) {
            error = err;
        }
        expect(error).to.be.an('Error');
        expect(result).to.be.an('null');
    });
});