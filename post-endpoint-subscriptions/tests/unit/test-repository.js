'use strict';

const chai = require('chai');
const expect = chai.expect;
const AWS_MOCK = require('aws-sdk-mock');
const NotificationStore = require('../../repositories/NotificationStore');

describe('Tests NotificationStore Repository', function () {
    before(function () {
        AWS_MOCK.mock('SNS', 'publish', function(params, callback) {
            callback(null, {
                MessageId: 'Msg-001'
            });
        });
    });

    after(function () {
        AWS_MOCK.restore();
    });

    it('verifies NotificationStore publishMessage method success', async () => {
        const store = new NotificationStore();
        var result = null;
        var error = null;
        try {
            result = await store.publishMessage('arn:topic_name', JSON.stringify({key: 'value'}));
        }
        catch(err) {
            error = err;
        }
        expect(error).to.be.a('null');
        expect(result).to.be.an('object');
        expect(result).to.have.property('MessageId');
    });
});