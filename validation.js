// VALIDATION
const Joi = require('joi');


// REGISTER VALIDATION
const registerValidation = data => {
        const schema = Joi.object({
                username: Joi.string()
                        .min(6)
                        .required(),
                name: Joi.string()
                        .min(6)
                        .required(),
                passwordHash: Joi.string()
                        .min(6)
                        .required(), 
        });
        return schema.validate(data);
};

// LOGIN VALIDATION
const loginValidation = data => {
    const schema = Joi.object({
        username: Joi.string()
                .min(6)
                .required(),
        passwordHash: Joi.string()
                .min(6)
                .required()
    });
    return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;