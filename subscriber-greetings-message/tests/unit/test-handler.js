'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require("sinon");
var proxyquire = require("proxyquire");
proxyquire = proxyquire.noCallThru().noPreserveCache();

describe('Tests index', () => {
    before(function() {
        process.env.ENABLE_CORS = 'yes';
        process.env.PROJECT_ID = 'Proj-001';
        process.env.TEMPLATE = "test-template";
    });

    it('verifies successful response', async () => {
        var handleSubscriptionGreetingsFake = sinon.fake.returns({Id: "Msg-001"});
        function Controller() {
            this.handleSubscriptionGreetings = handleSubscriptionGreetingsFake
        };
        var app = proxyquire('../../app.js', {
            "./Controller": Controller
        });

        const endpoint = {
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
        };

        let event = {
            "Records": [
                {
                    "EventSource": "aws:sns",
                    "EventVersion": "1.0",
                    "EventSubscriptionArn": "arn:aws:sns:us-west-2:{{{accountId}}}:ExampleTopic",
                    "Sns": {
                        "Type": "Notification",
                        "MessageId": "95df01b4-ee98-5cb9-9903-4c221d41eb5e",
                        "TopicArn": "arn:aws:sns:us-west-2:123456789012:ExampleTopic",
                        "Subject": "example subject",
                        "Message": JSON.stringify(endpoint),
                        "Timestamp": "1970-01-01T00:00:00.000Z",
                        "SignatureVersion": "1",
                        "Signature": "EXAMPLE",
                        "SigningCertUrl": "EXAMPLE",
                        "UnsubscribeUrl": "EXAMPLE",
                        "MessageAttributes": {
                            "Test": {
                                "Type": "String",
                                "Value": "TestString"
                            },
                            "TestBinary": {
                                "Type": "Binary",
                                "Value": "TestBinary"
                            }
                        }
                    }
                }
            ]
        };

        let response = await app.lambdaHandler(event);
        expect(response).to.be.an('string', 'Success');
        expect(handleSubscriptionGreetingsFake.calledOnceWith(process.env.PROJECT_ID, {
            templateName: "test-template",
            endpoint
        })).to.be.true;
    });
});