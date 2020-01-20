'use strict';

module.exports = class LoggerService {
    constructor() {}

    log(name, level, message, data, timestamp) {
        if(process.env.STAGE === 'TEST') return;
        let line = `${name} | ${level} | ${message} | ${data} | ${timestamp}`;
        console.log(line);
    }

    logError(err) {
        if(process.env.STAGE === 'TEST') return;
        console.log(err);
    }
}