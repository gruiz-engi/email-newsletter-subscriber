'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require("sinon");
var proxyquire = require("proxyquire");
proxyquire = proxyquire.noCallThru().noPreserveCache();

describe('Tests index', () => {
    before(function() {
        process.env.ENABLE_CORS = 'yes';
        process.env.TOPIC = 'arn:topic_name';
    });

    it('verifies successful response', async () => {
        var handleEmailSubscriptionFake = sinon.fake.returns({Id: "End-001"});
        function Controller() {
            this.handleEmailSubscription = handleEmailSubscriptionFake
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
                LatestsNlOptStatus: "OptIn",
                OptStatusLastChanged: "2019-05-15T10:05:59.064Z",
                OptSource: "unit_test"
            },
            Demographic: {
                Timezone: 'America/Puerto_Rico'
            }
        };

        let response = await app.lambdaHandler({
            pathParameters: {
                id: "03f2a240-6ffe-11e9-9b22-55e5ea0868b0"
            },
            requestContext: {
                identity: {
                    cognitoIdentityPoolId: null,
                    cognitoIdentityId: null,
                    userArn: "arn:aws:iam::123456789012:user/TUser"
                },
                stage: "test"
            },
            body: JSON.stringify(endpoint)
        }, 
        {
            invokedFunctionArn: "arn:aws:lambda:aws-region:aws-account-id:function:function-name:dev",
            authorizer: {
                userId: "User-001",
                endpointId: "End-001"
            }
        });
        expect(response).to.be.an('object');
        expect(response.statusCode).to.be.equal(202);
        let body = JSON.parse(response.body);
        expect(body).to.have.property('Id').and.to.be.an('string');
        expect(handleEmailSubscriptionFake.calledOnceWith(process.env.TOPIC, endpoint)).to.be.true;
    });

    it('verifies error response code 400', async () => {
        var e = new Error("Test Error");
        e.name = "RequiredFieldError";
        var handleEmailSubscriptionFake = sinon.fake.throws(e);
        function Controller() {
            this.handleEmailSubscription = handleEmailSubscriptionFake
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
                LatestsNlOptStatus: "OptIn",
                OptStatusLastChanged: "2019-05-15T10:05:59.064Z",
                OptSource: "unit_test"
            },
            Demographic: {
                Timezone: 'America/Puerto_Rico'
            }
        };

        let response = await app.lambdaHandler({
            pathParameters: {
                id: "End-001"
            },
            requestContext: {
                identity: {
                    cognitoIdentityPoolId: null,
                    cognitoIdentityId: null,
                    userArn: "arn:aws:iam::123456789012:user/TUser"
                },
                stage: "test"
            },
            body: JSON.stringify(endpoint)
        }, 
        {
            invokedFunctionArn: "arn:aws:lambda:aws-region:aws-account-id:function:function-name:dev",
            authorizer: {
                userId: "User-001",
                endpointId: ""
            }
        });
        expect(response).to.be.an('object');
        expect(response.statusCode).to.be.equal(400);
        let body = JSON.parse(response.body);
        expect(body).to.have.property('Message').and.to.be.an('string');
    });

    it('verifies error response code 404', async () => {
        var e = new Error("Test Error");
        e.name = "NotFoundException";
        var handleEmailSubscriptionFake = sinon.fake.throws(e);
        function Controller() {
            this.handleEmailSubscription = handleEmailSubscriptionFake
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
                LatestsNlOptStatus: "OptIn",
                OptStatusLastChanged: "2019-05-15T10:05:59.064Z",
                OptSource: "unit_test"
            },
            Demographic: {
                Timezone: 'America/Puerto_Rico'
            }
        };

        let response = await app.lambdaHandler({
            pathParameters: {
                id: "End-001"
            },
            requestContext: {
                identity: {
                    cognitoIdentityPoolId: null,
                    cognitoIdentityId: null,
                    userArn: "arn:aws:iam::123456789012:user/TUser"
                },
                stage: "test"
            },
            body: JSON.stringify(endpoint)
        }, 
        {
            invokedFunctionArn: "arn:aws:lambda:aws-region:aws-account-id:function:function-name:dev",
            authorizer: {
                userId: "User-001",
                endpointId: ""
            }
        });
        expect(response).to.be.an('object');
        expect(response.statusCode).to.be.equal(404);
        let body = JSON.parse(response.body);
        expect(body).to.have.property('Message').and.to.be.an('string');
    });

    it('verifies error response code 500', async () => {
        var e = new Error("Test Error");
        e.name = "UnknownError";
        var handleEmailSubscriptionFake = sinon.fake.throws(e);
        function Controller() {
            this.handleEmailSubscription = handleEmailSubscriptionFake
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
                LatestsNlOptStatus: "OptIn",
                OptStatusLastChanged: "2019-05-15T10:05:59.064Z",
                OptSource: "unit_test"
            },
            Demographic: {
                Timezone: 'America/Puerto_Rico'
            }
        };

        let response = await app.lambdaHandler({
            pathParameters: {
                id: "End-001"
            },
            requestContext: {
                identity: {
                    cognitoIdentityPoolId: null,
                    cognitoIdentityId: null,
                    userArn: "arn:aws:iam::123456789012:user/TUser"
                },
                stage: "test"
            },
            body: JSON.stringify(endpoint)
        }, 
        {
            invokedFunctionArn: "arn:aws:lambda:aws-region:aws-account-id:function:function-name:dev",
            authorizer: {
                userId: "User-001",
                endpointId: ""
            }
        });
        expect(response).to.be.an('object');
        expect(response.statusCode).to.be.equal(500);
        let body = JSON.parse(response.body);
        expect(body).to.have.property('Message').and.to.be.an('string');
    });
});