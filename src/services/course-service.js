const { CourseRepository } = require("../database");
const { FormateData, GeneratePassword, GenerateSalt, GenerateSignature, RenewGenerateSignature, ValidatePassword } = require('../utils');
const { APIError, BadRequestError, DataNotFoundError, STATUS_CODES } = require('../utils/app-errors')
const { sendMailToStudent } = require('../utils/node-mailer')
const { APP_SECRET } = require("../config");

const fs = require('fs');
const path = require('path')
var randomstring = require("randomstring");


// All Business logic will be here
class CourseService {

    constructor() {
        this.repository = new CourseRepository();
    }

    async Course(userInputs) {

        const { courseName } = userInputs;
        console.log("userInputs >>>>", userInputs);

        try {
            const existingCourse = await this.repository.FindCourse({ courseName });

            if (existingCourse) {
                return FormateData({ status: 200, message: "Course Already Exist." });
            }
            // create salt

            const insertCourse = await this.repository.CreateCourse({ courseName });

            return FormateData({ status: 200, message: "Create Course Successfully." });

        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });

            throw new APIError('Data Not found', error)
        }
    }


    async GetAllCourse(userInputs) {
        try {
            const getCourses = await this.repository.GetAllCourse();

            return FormateData({ status: 200, courses: getCourses });

        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });

            throw new APIError('Data Not found', error)
        }

    }

    async DeleteCourse(userInputs) {


        try {
            const { courseId } = userInputs;

            const deleteStatus = await this.repository.DeleteCourse({ courseId });
            console.log("deleteStatus ======", deleteStatus);
            if (deleteStatus.deletedCount) {
                return FormateData({ status: 200, message: "Course Deleted Successfully." });
            } else {
                return FormateData({ status: 404, message: "Something want wrong." });
            }

        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });
            throw new APIError('Data Not found', error)
        }
    }

    async UpdateCourse(userInputs) {

        const { courseId, courseName } = userInputs;
        console.log("userInputs >>>>", userInputs);

        try {
            const updateCourse = await this.repository.UpdateCourse({ courseId, courseName });
            return FormateData({ status: 200, message: "Update Course Successfully.", data: updateCourse });
        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });
            throw new APIError('Data Not found', error)
        }
    }

    //Create course main topics content
    async CourseMainTopicHeading(userInputs) {


        try {
            const { courseId, topicHeadingName, topicLevel } = userInputs;

            const existingCourseMainTopic = await this.repository.FindCourseMainTopics({ topicHeadingName });

            if (existingCourseMainTopic) {
                return FormateData({ status: 200, message: "Course Topic Already Exist." });
            }
            // create salt

            const insertCourse = await this.repository.CreateCourseMainTopicHeading({ courseId, courseId, topicHeadingName, topicLevel });

            return FormateData({ status: 200, message: "Created Course Mian Topic Heading Successfully.", data: insertCourse });

        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });

            throw new APIError('Data Not found', error)
        }
    }

    async GetSingleMainTopicHeading(userInputs) {
        try {
            let { _id } = userInputs;
            const getCourses = await this.repository.GetMainTopicHeading({ _id });
            return FormateData({ status: 200, courses: getCourses });
        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });
        }
    }

    async GetAllMainTopicHeading() {
        try {
            const getCourses = await this.repository.GetAllMainTopicHeading();
            return FormateData({ status: 200, courses: getCourses });
        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });
        }
    }

    async DeleteMainTopicHeading(userInputs) {
        try {
            const { _id } = userInputs;

            const deletedCourseStatus = await this.repository.DeleteCourseMainTopicHeading({ _id });
            console.log("deletedCourseStatus ==== ", deletedCourseStatus)
            if (deletedCourseStatus.deletedCount) {
                return FormateData({ status: 200, message: "Deleted Course Main Topic Heading Successfully." });
            } else {
                return FormateData({ status: 400, message: "Something want wrong." });
            }

        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });
        }
    }

    async UpdateMainTopicHeading(userInputs) {
        const { courseMinaTopicId, mainTopicHeadingName, mainTopicVideoLevel } = userInputs;
        console.log("userInputs >>>>", userInputs);

        try {
            const updateCourse = await this.repository.UpdateCourseMainTopicHeading({ courseMinaTopicId, mainTopicHeadingName, mainTopicVideoLevel });
            console.log("updateCourse>>>>>", updateCourse)
            if (updateCourse !== null) {
                return FormateData({ status: 200, message: "Update Course Main Heading Successfully.", data: updateCourse });
            } else {
                return FormateData({ status: 400, message: "Something went wrong." });
            }
        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });
            throw new APIError('Data Not found', error)
        }
    }

    async CourseSubTopicHeading(userInputs) {

        try {
            const { courseId, courseMainTopicId, subTopicHeadingName, subTopicLevel } = userInputs;

            const existingCourseMainTopic = await this.repository.FindCourseMainTopics({ subTopicHeadingName });

            if (existingCourseMainTopic) {
                return FormateData({ status: 200, message: "Course Sub Topic Already Exist." });
            }
            // create salt

            const insertCourse = await this.repository.CreateCourseSubTopicHeading({ courseId, courseMainTopicId, subTopicHeadingName, subTopicLevel });

            return FormateData({ status: 200, message: "Created Course Sub Topic Heading Successfully.", data: insertCourse });

        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });

            throw new APIError('Data Not found', error)
        }
    }

    async GetSingleSubTopic(userInputs) {
        try {
            let { _id } = userInputs;
            const getCourses = await this.repository.GetSingleSubTopicHeading({ _id });
            return FormateData({ status: 200, courses: getCourses });
        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });
        }
    }

    async GetAllSubTopicHeading() {
        try {
            const getCourses = await this.repository.GetAllSubTopicHeading();
            return FormateData({ status: 200, courses: getCourses });
        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });
        }
    }

    async DeleteSubTopicHeading(userInputs){
        try {
            const { _id } = userInputs;

            const deletedCourseStatus = await this.repository.DeleteCourseSubTopicHeading({ _id });
            console.log("deletedCourseStatus ==== ", deletedCourseStatus)
            if (deletedCourseStatus.deletedCount) {
                return FormateData({ status: 200, message: "Deleted Course Sub Topic Heading Successfully." });
            } else {
                return FormateData({ status: 400, message: "Something want wrong." });
            }
        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });
        }
    }

    async UpdateSubTopicHeading(userInputs) {
        const { courseSubTopicId, subTopicHeadingName, subTopicVideoLevel } = userInputs;
        console.log("userInputs >>>>", userInputs);

        try {
            const updateCourse = await this.repository.UpdateCourseSubTopicHeading({ courseSubTopicId, subTopicHeadingName, subTopicVideoLevel });
            console.log("updateCourse>>>>>", updateCourse)
            if (updateCourse !== null) {
                return FormateData({ status: 200, message: "Update Course Sub Heading Successfully.", data: updateCourse });
            } else {
                return FormateData({ status: 400, message: "Something went wrong." });
            }
        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });
            throw new APIError('Data Not found', error)
        }

    }


    //Create course subTopic video content
    async CourseSubTopicVideo(userInputs) {

        try {
            const { courseId, courseMainTopicId, courseSubTopicId, videoHeading, subTopicVideo, subTopicVideoLevel } = userInputs;

            const existingCourseMainTopic = await this.repository.FindCourseSubTopicVideo({ videoHeading });

            if (existingCourseMainTopic) {
                return FormateData({ status: 200, message: "Course Sub Topic Video Already Exist." });
            }
            // create salt

            const insertCourse = await this.repository.CreateCourseSubTopicVideo({ courseId, courseMainTopicId, courseSubTopicId, videoHeading, subTopicVideo, subTopicVideoLevel });

            return FormateData({ status: 200, message: "Created Course Sub Topic Video Successfully.", data: insertCourse });

        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });
        }
    }

    //Delete course subTopic video content
    async DeleteSubTopicVideoContent(userInputs) {

        try {
            const { courseSubTopicId } = userInputs;

            const deletedCourseStatus = await this.repository.DeleteCourseSubTopicVideoContent({ courseSubTopicId });
            console.log("deletedCourseStatus ==== ", deletedCourseStatus)
            if (deletedCourseStatus.deletedCount) {
                return FormateData({ status: 200, message: "Deleted Course Sub Topic Video Successfully." });

            } else {
                return FormateData({ status: 400, message: "Something want wrong." });

            }

        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });
        }
    }

    //Get single course subTopic video content
    async GetSingleSubTopicVideoContent(userInputs) {

        try {
            const { courseSubTopicId } = userInputs;
            const getCourseData = await this.repository.GetCourseSingleSubTopicVideoContent({ courseSubTopicId });
            if (getCourseData !== null) {
                return FormateData({ status: 200, message: "Get Course Sub Topic Video Content.", data: getCourseData });

            } else {
                return FormateData({ status: 200, message: "Data Not Found.", data: getCourseData });

            }

        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });
        }
    }

    //Get all course subTopic video content
    async GetAllSubTopicVideoContent() {
        try {
            const getCourseData = await this.repository.GetCourseAllSubTopicVideoContent();
            if (getCourseData !== null) {
                return FormateData({ status: 200, message: "Get Course All Sub Topic Successfully.", data: getCourseData });
            } else {
                return FormateData({ status: 200, message: "Data Not Found.", data: getCourseData });
            }
        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });
        }
    }


    //Create course subTopic video content
    async UpdateSubTopicVideo(userInputs) {

        try {
            const { courseSubTopicId, videoHeading, subTopicVideo, subTopicVideoLevel } = userInputs;

            const updateCourseSubTopic = await this.repository.UpdateCourseSubTopicVideo({ courseSubTopicId, videoHeading, subTopicVideo, subTopicVideoLevel });

            return FormateData({ status: 200, message: "Updated Course Sub Topic Video Successfully.", data: updateCourseSubTopic });

        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });

            throw new APIError('Data Not found', error)
        }
    }
}

module.exports = CourseService;