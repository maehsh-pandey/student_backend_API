import Joi from "joi";

//user update vlaidation
export const createJobValidationSchema = Joi.object({
    company: Joi.string().required(),
    position: Joi.string().required(),
    status: Joi.string().optional().allow(""),
    workType: Joi.string().optional().allow(""),
    workLocation: Joi.string().optional().allow(""),
  });

//jobId vlaidation
export const checkJobIdValidationSchema = Joi.object({
    id: Joi.string().required()
});
