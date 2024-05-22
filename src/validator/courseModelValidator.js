// import Joi from "joi";
const Joi = require("joi");

//course validation
const createCourseValidation = Joi.object({
    courseName: Joi.string().min(3).max(30).required(),
});

//course main topic validation
const courseTopicesValidation = Joi.object({
    courseId : Joi.string().required(),
    topicHeadingName: Joi.string().min(3).max(30).required(),
    topicLevel: Joi.string().min(1).max(3).required(),
});

//course sub topic validation
const courseSubTopicesValidation = Joi.object({
    courseId : Joi.string().required(),
    courseMainTopicId : Joi.string().required(),
    subTopicHeadingName: Joi.string().min(3).max(30).required(),
    subTopicLevel: Joi.string().min(1).max(3).required(),
});

//course sub topic video validation
const courseSubTopiceVideoValidation = Joi.object({
    courseId : Joi.string().required(),
    courseMainTopicId : Joi.string().required(),
    courseSubTopicId : Joi.string().required(),
    videoHeading : Joi.string().min(3).max(30).required(),
    subTopicVideo : Joi.string().required(),
    subTopicVideoLevel : Joi.string().min(1).max(3).required(),
});

//update sub topic video validation
const updateSubTopiceVideoValidation = Joi.object({
    courseSubTopicId : Joi.string().required(),
    subTopicHeadingName : Joi.string().min(3).max(30).required(),
    subTopicVideoLevel : Joi.string().required(),
});

//update main topic heading validation
const updateMainTopiceHeadingValidation = Joi.object({
    courseMinaTopicId : Joi.string().required(),
    mainTopicHeadingName : Joi.string().min(3).max(30).required(),
    mainTopicVideoLevel : Joi.string().required(),
});

//update sub topic heading validation
const updateSubTopiceHeadingValidation = Joi.object({
    courseSubTopicId : Joi.string().required(),
    subTopicHeadingName : Joi.string().min(3).max(30).required(),
    subTopicVideoLevel : Joi.string().required(),
});

//get single sub topic video validation
const getSingleSubTopiceVideoDataValidation = Joi.object({
    courseSubTopicId : Joi.string().required(),
});

//get single mian topic video validation
const getTopiceHeadingValidation = Joi.object({
    _id : Joi.string().required(),
});



//delete single mian topic heading
const deleteTopiceHeadingValidation = Joi.object({
    _id : Joi.string().required(),
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




module.exports = {
    createCourseValidation,
    courseTopicesValidation,
    courseSubTopicesValidation,
    courseSubTopiceVideoValidation,
    getSingleSubTopiceVideoDataValidation,
    getTopiceHeadingValidation,
    deleteTopiceHeadingValidation,
    updateSubTopiceVideoValidation,
    updateMainTopiceHeadingValidation,
    updateSubTopiceHeadingValidation
}  