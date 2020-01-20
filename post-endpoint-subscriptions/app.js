'use strict';
const Controller = require('./Controller');

exports.lambdaHandler = async (event, context) => {
    let response = {};
    var body = null;
    var controller = null;
    try {
        body = JSON.parse(event.body);
        controller = new Controller();
        let result = await controller.handleEmailSubscription(
            process.env.TOPIC,
            body
        );
        response['statusCode'] = 202;
        response['body'] = JSON.stringify(result);
    } catch (err) {
        switch(err.name) {
            case 'RequiredFieldError':
            case 'MultipleValidationErrors':
            case 'UnexpectedParameter':
            case 'BadRequestException':
                response['statusCode'] = 400;
                response['body'] = JSON.stringify({ Message: err.message });
                break;
            case 'NotFoundException':
                response['statusCode'] = 404;
                response['body'] = JSON.stringify({ Message: err.message });
                break;
            default:
                response['statusCode'] = 500;
                response['body'] = JSON.stringify({ Message: "Internal Server Error" });
                break;
        }
    }
    return response
};