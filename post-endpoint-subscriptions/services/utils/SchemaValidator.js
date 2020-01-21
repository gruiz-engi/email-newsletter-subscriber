const Schema = require('validate');
const ModelSchema = require('./schema');

module.exports = class SchemaValidator {
    constructor() {
        this.model = new Schema(ModelSchema, { strip: true });
    }

    /**
     * 
     * @param {Object} target - object to validate against schema
     */
    checkValidity(target) {
        const errors = this.model.validate(target);
        if(errors.length > 0) {
            const err = new Error();
            if(errors.length > 1) {
                err.name = "MultipleValidationErrors";
                err.message = errors.map((item) => item.message + " ").reduce((prev, current) => prev + current, "");
            }
            else {
                err.name = "BadRequestException";
                err.message = errors[0].message;
            }
            throw err;
        }
        return;
    }
}