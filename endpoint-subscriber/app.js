'use strict';
const Controller = require('./Controller');

exports.lambdaHandler = async (event, context) => {
    let response = "Success";
    var controller = new Controller();
    for (let index = 0; index < event.Records.length; index++) {
        try {
            const { Sns: { Message } } = event.Records[index];
            const body = JSON.parse(Message);
            await controller.handleEmailSubscription(
                process.env.PROJECT_ID,
                body
            );
        } catch (err) {}
    }

    return response;
};