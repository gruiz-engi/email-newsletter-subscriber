
module.exports = {
    Address: {
        type: String,
        required: true
    },
    Attributes: {
        required: true,
        properties: {
            OptStatusLastChanged: {
                type: String,
                required: true
            },
            OptSource:{
                type: String,
                required: true
            },
            MonthlyNlOptStatus: {
                type: String,
                enum: ['OptIn', 'OptOut']
            }
        }
    },
    User: {
        required: false,
        properties: {
            Attributes: {
                properties: {
                    Firstname: {
                        type: String
                    },
                    Lastname:{
                        type: String
                    }
                }
            }
        }
    }
}