import Joi from "joi";
export const userSignupValidationSchema = Joi.object({
    userName: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    // address: {
    //   addressLine: Joi.string().max(50).required(),
    //   state: Joi.string().max(15).required(),
    //   country: Joi.string().max(20).required(),
    //   zipCode: Joi.string().max(7).required(),
    // },
    phoneNumber: Joi.string()
      .length(10)
      .pattern(/[6-9]{1}[0-9]{9}/)
      .required(),
    password: Joi.string().alphanum().pattern(new RegExp("^[a-zA-Z0-9@]{3,30}$")),
    address: Joi.string().optional().allow(""),
    userType: Joi.string().optional().allow(""),
    // confirmPassword: Joi.ref("password"),
  });

//user sigIn vlaidation
export const userSigInValidationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().alphanum().pattern(new RegExp("^[a-zA-Z0-9@]{3,30}$")),
    // confirmPassword: Joi.ref("password"),
  });




 



 