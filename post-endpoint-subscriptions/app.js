'use strict';
const Controller = require('./Controller');

exports.lambdaHandler = async (event, context) => {
    let response = {};
    if(process.env.ENABLE_CORS) {
        response['headers'] = {
            "Access-Control-Allow-Origin": process.env.ALLOW_ORIGIN,
        };
    }
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
            case 'SyntaxError':
                if(err.message.includes("JSON")) {
                    response['statusCode'] = 400;
                    response['body'] = JSON.stringify({ Message: "Malformed JSON body" });
                }
                else {
                    response['statusCode'] = 500;
                    response['body'] = JSON.stringify({ Message: "Internal Server Error" });
                }
                break;
            default:
                response['statusCode'] = 500;
                response['body'] = JSON.stringify({ Message: "Internal Server Error" });
                break;
        }
    }
    return response
};