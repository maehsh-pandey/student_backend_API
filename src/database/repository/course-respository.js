const { CourseModel, CourseMainTopics, CourseSubTopics, CourseSubTopicVideo } = require('../models');
const { APIError, BadRequestError, STATUS_CODES } = require('../../utils/app-errors')
const { FormateData } = require('../../utils');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
//Dealing with data base operations
class CourseRepository {

    async CreateCourse({ courseName }) {
        try {
            console.log("courseName >>>>", courseName);
            const course = new CourseModel({
                courseName
            })
            const courseResult = await course.save();
            return courseResult;
        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });

            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Create Customer')
        }
    }

    async GetAllCourse() {
        try {
            const coursesResult = await CourseModel.find();
            return coursesResult;
        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });

            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Create Customer')
        }
    }

    async UpdateCourse({ courseId, courseName }) {
        try {
            const courseResult = await CourseModel.findOneAndUpdate({ _id: courseId }, { $set: { courseName: courseName } });
            return courseResult;
        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });

            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Create Customer')
        }
    }

    async DeleteCourse({ courseId }) {
        try {
            console.log("courseId delete======= ", courseId)
            const courseResult = await CourseModel.deleteOne({ _id: courseId });
            return courseResult;
        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });

            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Create Customer')
        }
    }

    async CreateCourseMainTopicHeading({ courseId, topicHeadingName, topicLevel }) {
        try {
            // console.log("courseName >>>>",courseName);
            const course = new CourseMainTopics({
                courseId,
                topicHeadingName,
                topicLevel
            })
            const courseResult = await course.save();
            return courseResult;
        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });

            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Create Customer')
        }
    }

    async GetMainTopicHeading({ _id }) {
        try {
            const coursesMainHeadingResult = await CourseMainTopics.find({ _id: _id });
            return coursesMainHeadingResult;
        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });
        }
    }

    async GetAllMainTopicHeading() {
        try {
            const coursesMainHeadingResult = await CourseMainTopics.find();
            return coursesMainHeadingResult;
        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });
        }
    }

    async DeleteCourseMainTopicHeading({ _id }) {
        try {
            const mainTopicResult = await CourseMainTopics.deleteOne({ _id: _id });
            return mainTopicResult;
        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });
        }
    }

    async UpdateCourseMainTopicHeading({ courseMinaTopicId, mainTopicHeadingName, mainTopicVideoLevel }) {
        try {
            const courseResult = await CourseMainTopics.findOneAndUpdate({ _id: courseMinaTopicId }, { $set: { topicHeadingName: mainTopicHeadingName, topicLevel: mainTopicVideoLevel } });
            return courseResult;
        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });

            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Create Customer')
        }
    }

    async CreateCourseSubTopicHeading({ courseId, courseMainTopicId, subTopicHeadingName, subTopicLevel }) {
        try {
            console.log("CreateCourseSubTopicHeading >>>>", { courseId, courseMainTopicId, subTopicHeadingName, subTopicLevel });
            const course = new CourseSubTopics({
                courseId,
                courseMainTopicId,
                subTopicHeadingName,
                subTopicLevel
            })
            const courseResult = await course.save();
            return courseResult;
        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });

            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Create Customer')
        }
    }

    async GetSingleSubTopicHeading({_id}) {
        try {
            const coursesSubHeadingResult = await CourseSubTopics.find({ _id: _id });
            return coursesSubHeadingResult;
        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });
        }
    }

    async GetAllSubTopicHeading() {
        try {
            const coursesSubHeadingResult = await CourseSubTopics.find();
            return coursesSubHeadingResult;
        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });
        }
    }

    async DeleteCourseSubTopicHeading({_id}){
        try {
            const subTopicResult = await CourseSubTopics.deleteOne({ _id: _id });
            return subTopicResult;
        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });
        }

    }

    async UpdateCourseSubTopicHeading({courseSubTopicId, subTopicHeadingName, subTopicVideoLevel}){
        try {

            console.log("courseSubTopicId >>>>>",courseSubTopicId, subTopicHeadingName, subTopicVideoLevel)
            const courseResult = await CourseSubTopics.findOneAndUpdate({ _id: courseSubTopicId }, { $set: { subTopicHeadingName: subTopicHeadingName, subTopicLevel: subTopicVideoLevel } });
            return courseResult;
        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });

            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Create Customer')
        }
    }

    //Insert Create new course data in db
    async CreateCourseSubTopicVideo({ courseId, courseMainTopicId, courseSubTopicId, videoHeading, subTopicVideo, subTopicVideoLevel }) {
        try {
            console.log("CreateCourseSubTopicHeading >>>>", { courseId, courseMainTopicId, courseSubTopicId, subTopicVideoLevel });
            const course = new CourseSubTopicVideo({
                courseId,
                courseMainTopicId,
                courseSubTopicId,
                videoHeading,
                subTopicVideo,
                subTopicVideoLevel
            })
            const courseResult = await course.save();
            return courseResult;
        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });

            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Create Customer')
        }
    }



    async DeleteCourseSubTopicVideoContent({ courseSubTopicId }) {
        try {
            const subTopicResult = await CourseSubTopicVideo.deleteOne({ _id: courseSubTopicId });
            return subTopicResult;
        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });
        }
    }


    async GetCourseSingleSubTopicVideoContent({ courseSubTopicId }) {
        try {
            console.log("subTopicIddfdfdf =========", courseSubTopicId)
            const coursesResult = await CourseSubTopicVideo.findOne({ _id: courseSubTopicId });
            return coursesResult;
        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });
        }
    }

    async GetCourseAllSubTopicVideoContent() {
        try {
            const coursesResult = await CourseSubTopicVideo.find();
            return coursesResult;
        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });
        }
    }

    async UpdateCourseSubTopicVideo({ courseSubTopicId, videoHeading, subTopicVideo, subTopicVideoLevel }) {
        try {
            var id = new ObjectId(courseSubTopicId);
            console.log("courseSubTopicId >>>", courseSubTopicId.trim().length, "652a3463223ebd56f98d0c0f".length);

            const courseResult = await CourseSubTopicVideo.findOneAndUpdate({ _id: courseSubTopicId }, { $set: { videoHeading: videoHeading, subTopicVideo: subTopicVideo, subTopicVideoLevel: subTopicVideoLevel } });
            return courseResult;
        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });

            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Create Customer')
        }
    }
    async FindCourse(userData) {
        try {
            const existingCourse = await CourseModel.findOne(userData);
            return existingCourse;
        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });
        }
    }

    async FindCourseMainTopics(userData) {
        try {
            const existingCourseMainTopic = await CourseMainTopics.findOne(userData);
            return existingCourseMainTopic;
        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });
        }
    }

    async FindCourseSubTopics(userData) {
        try {
            const existingCourseSubTopic = await CourseSubTopics.findOne(userData);
            return existingCourseSubTopic;
        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });
        }
    }

    async FindCourseSubTopicVideo(userData) {
        try {
            const existingCourseSubTopic = await CourseSubTopicVideo.findOne(userData);
            return existingCourseSubTopic;
        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });
        }
    }
}

module.exports = CourseRepository;