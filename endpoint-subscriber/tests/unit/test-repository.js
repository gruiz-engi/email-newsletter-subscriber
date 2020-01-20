'use strict';

const chai = require('chai');
const expect = chai.expect;
const AWS_MOCK = require('aws-sdk-mock');
const EngagementStore = require('../../repositories/EngagementStore');

describe('Tests EngagementStore Repository', function () {
    before(function () {
        AWS_MOCK.mock('Pinpoint', 'updateEndpoint', function(params, callback) {
            callback(null, {
                MessageBody: {
                    Message: "OK",
                    RequestID: "Req-001"
                }
            });
        });
    });

    after(function () {
        AWS_MOCK.restore();
    });

    it('verifies EngagementStore updateEndpoint method success with all model fields', async () => {
        const store = new EngagementStore();
        var result = null;
        var error = null;
        try {
            result = await store.updateEndpoint('Proj-001', "User-001", "End-001",
            {
                User: {
                    Attributes: {
                        Firstname: [
                            "Guillermo"
                        ],
                        Lastname: [
                            "Ruiz"
                        ],
                        Interests: [
                            "Node.js"
                        ]
                    }
                },
                Address: "test@email.com",
                Attributes: {
                    LatestsNlOptStatus: [
                        "OptIn"
                    ],
                    OptStatusLastChanged: [
                        "2019-05-15T10:05:59.064Z"
                    ],
                    OptSource: [
                        "unit_test"
                    ]
                },
                ChannelType: "EMAIL",
                CreatedOn: "2019-05-15T10:05:59.064Z",
                Demographic: {},
                UpdatedOn: "2019-05-15T10:05:59.064Z",
                Location: {},
                OptOutAll: false,
                OptOut: 'NONE'
            });
        }
        catch(err) {
            error = err;
        }
        expect(error).to.be.a('null');
        expect(result).to.be.an('object');
        expect(result.MessageBody).to.have.property('RequestID').and.to.be.equal('Req-001');
    });

    it('verifies EngagementStore updateEndpoint method success with only model required fields', async () => {
        const store = new EngagementStore();
        var result = null;
        var error = null;
        try {
            result = await store.updateEndpoint('Proj-001', "User-001", "End-001",
            {
                Attributes: {
                    LatestsNlOptStatus: [
                        "OptIn"
                    ],
                    OptStatusLastChanged: [
                        "2019-05-15T10:05:59.064Z"
                    ],
                    OptSource: [
                        "unit_test"
                    ]
                },
                UpdatedOn: "2019-05-15T10:05:59.064Z"
            });
        }
        catch(err) {
            error = err;
        }
        expect(error).to.be.a('null');
        expect(result).to.be.an('object');
        expect(result.MessageBody).to.have.property('RequestID').and.to.be.equal('Req-001');
    });

    it('verifies EngagementStore updateEndpoint method throw error of missing required field', async () => {
        const store = new EngagementStore();
        var result = null;
        var error = null;
        try {
            result = await store.updateEndpoint(null, "User-001", "End-001",
            {
                Endpoint: {
                    User: {
                        Attributes: {
                            Firstname: [
                                "Guillermo"
                            ],
                            Lastname: [
                                "Ruiz"
                            ],
                            Interests: [
                                "Node.js"
                            ]
                        }
                    },
                    Address: "test@email.com",
                    Attributes: {
                        LatestsNlOptStatus: [
                            "OptIn"
                        ],
                        OptStatusLastChanged: [
                            "2019-05-15T10:05:59.064Z"
                        ],
                        OptSource: [
                            "unit_test"
                        ]
                    },
                    ChannelType: "EMAIL",
                    CreatedOn: "2019-05-15T10:05:59.064Z",
                    Demographic: {},
                    UpdatedOn: "2019-05-15T10:05:59.064Z",
                    Location: {},
                    OptOutAll: false,
                    OptOut: 'NONE'
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