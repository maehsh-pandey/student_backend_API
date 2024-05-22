// import Joi from "joi";
const Joi = require("joi");

//Student signup vlaidation
const signUpValidationSchema = Joi.object({
    // userId: Joi.string().required(),
    // userName: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().alphanum().pattern(new RegExp("^[a-zA-Z0-9@]{3,30}$")),

    phone: Joi.string()
        .length(10)
        .pattern(/[6-9]{1}[0-9]{9}/)
        .required(),
    occupation: Joi.string().required(),
    systemIpAddress: Joi.string().required(),
    role: Joi.string().optional(""),


    //password: Joi.string().alphanum().pattern(new RegExp("^[a-zA-Z0-9@]{3,30}$")),
    // confirmPassword: Joi.ref("password"),
});

//Student sign vlaidation
const signValidationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().alphanum().pattern(new RegExp("^[a-zA-Z0-9@]{3,30}$")),
});

//Change password validation
const changePasswordValidationSchema = Joi.object({
    userId: Joi.string().required(),
    password: Joi.string().alphanum().pattern(new RegExp("^[a-zA-Z0-9@]{3,30}$")),
    oldPassword: Joi.string().alphanum().pattern(new RegExp("^[a-zA-Z0-9@]{3,30}$")),
});

//Forgot password validation
const forgotPasswordValidationSchema = Joi.object({
    email: Joi.string().email().required(),

});

//Forgot password validation
const resetPasswordValidationSchema = Joi.object({
    // token: Joi.string().required(),
    password: Joi.string().alphanum().pattern(new RegExp("^[a-zA-Z0-9@]{3,30}$")),
});

//Update profile validation
const updateProfileValidationSchema =  Joi.object({
    userId: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().alphanum().pattern(new RegExp("^[a-zA-Z0-9@]{3,30}$")),
    phone: Joi.string()
        .length(10)
        .pattern(/[6-9]{1}[0-9]{9}/)
        .required(),
    occupation: Joi.string().required(),
    systemIpAddress: Joi.string().required()
});


// //user update vlaidation
// const userDeleteValidationSchema = Joi.object({
//     userId: Joi.string().required()
// });

// //userType vlaidation
// const checkAdminValidationSchema = Joi.object({
//     userType: Joi.string().required()
// });

// //userId vlaidation
// const checkUserIdValidationSchema = Joi.object({
//     userId: Joi.string().required()
// });



module.exports = {
    signUpValidationSchema,
    signValidationSchema,
    changePasswordValidationSchema,
    forgotPasswordValidationSchema,
    resetPasswordValidationSchema,
    updateProfileValidationSchema
}  