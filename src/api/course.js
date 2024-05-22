const CourseService = require("../services/course-service");
const UserAuth = require("../api/middlewares/auth");
const isLogout = require("../api/middlewares/isLogout");
const {
    createCourseValidation,
    courseTopicesValidation,
    courseSubTopicesValidation,
    courseSubTopiceVideoValidation,
    getSingleSubTopiceVideoDataValidation,
    getTopiceHeadingValidation,
    deleteSubTopiceVideoDataValidation,
    deleteTopiceHeadingValidation,
    updateSubTopiceVideoValidation,
    updateMainTopiceHeadingValidation
} = require("../validator/courseModelValidator");
const { FormateData } = require('../utils');
const { systemIp } = require("../utils/system-ip")

var requestIp = require('request-ip');
const IP = require('ip');
const { STATUS_CODES } = require("../utils/app-errors");
const { upload } = require("../utils/upload-image");
//8700855380 saluja
module.exports = (app) => {
    const service = new CourseService();

    app.post("/student/course/create-course", UserAuth, async (req, res, next) => {
        try {

            const { courseName } = req.body;
            //validate request payload
            const { error, value } = await createCourseValidation.validate(req.body, {
                abortEarly: false,
            });

            if (error) {
                // next(error.details[0].message)
                res.json({ status: STATUS_CODES.NOT_FOUND, message: error.details[0].message });
            } else {
                const { data } = await service.Course({ courseName });
                return res.json(data);
            }
        } catch (error) {
            res.json({ status: STATUS_CODES.NOT_FOUND, message: error.message });
        }
    });


    app.get("/student/course/get-all-courses", UserAuth, async (req, res, next) => {
        try {
            const data = await service.GetAllCourse();
            return res.json(data);
        } catch (error) {
            res.json({ status: STATUS_CODES.NOT_FOUND, message: error.message });
        }
    });

    app.put("/student/course/update-course", UserAuth, async (req, res, next) => {
        try {
            let { courseId, courseName } = req.body;
            const data = await service.UpdateCourse({ courseId, courseName });
            return res.json(data);
        } catch (error) {
            res.json({ status: STATUS_CODES.NOT_FOUND, message: error.message });
        }
    });

    app.delete("/student/course/delete-course", UserAuth, async (req, res, next) => {
        try {
            let { courseId } = req.body;
            const data = await service.DeleteCourse({ courseId });
            return res.json(data);
        } catch (error) {
            res.json({ status: STATUS_CODES.NOT_FOUND, message: error.message });
        }
    });


    app.post("/student/course/course-main-topic-heading", UserAuth, async (req, res, next) => {
        try {

            const { courseId, topicHeadingName, topicLevel } = req.body;
            //validate request payload
            const { error, value } = await courseTopicesValidation.validate(req.body, {
                abortEarly: false,
            });

            if (error) {
                // next(error.details[0].message)
                res.json({ status: STATUS_CODES.NOT_FOUND, message: error.details[0].message });
            } else {
                const { data } = await service.CourseMainTopicHeading({ courseId, topicHeadingName, topicLevel });
                return res.json(data);
            }
        } catch (error) {
            res.json({ status: STATUS_CODES.NOT_FOUND, message: error.message });
        }
    });

    //Get main topic heading
    app.get("/student/course/get-course-main-topic-heading", UserAuth, async (req, res, next) => {
        try {
            const { _id } = req.body;
            console.log("courseSubTopicId ==== ",_id);
            const { error, value } = await getTopiceHeadingValidation.validate(req.body, {
                abortEarly: false,
            });

            if (error) {
                // next(error.details[0].message)
                res.json({ status: STATUS_CODES.NOT_FOUND, message: error.details[0].message });
            }
            else {
                const data = await service.GetSingleMainTopicHeading({ _id });
                return res.json(data);
            }
        } catch (error) {
            console.log("error.message >>>>>>", error)
            res.json({ status: 500, message: error });
        }
    });

    //Get all course main heading 
    app.get("/student/course/get-all-course-main-topic-heading", UserAuth, async (req, res, next) => {
        try {
                const data = await service.GetAllMainTopicHeading();
                return res.json(data);
        } catch (error) {
            console.log("error.message >>>>>>", error)
            res.json({ status: 500, message: error });
        }
    });

    //Delete main topic topic
    app.delete("/student/course/delete-course-main-topic-heading", UserAuth, async (req, res, next) => {
        try {
            const { _id } = req.body;

            const { error, value } = await deleteTopiceHeadingValidation.validate(req.body, {
                abortEarly: false,
            });

            if (error) {
                // next(error.details[0].message)
                res.json({ status: STATUS_CODES.NOT_FOUND, message: error.details[0].message });
            }
            else {
                const data = await service.DeleteMainTopicHeading({ _id });
                return res.json(data);
            }
        } catch (error) {
            console.log("error.message >>>>>>", error)
            res.json({ status: 500, message: error });
        }
    });

    //Update course main topic heading
    app.put("/student/course/update-course-main-topic-heading", UserAuth, upload.single('subTopicVideo'), async (req, res, next) => {
        try {
            const { courseMinaTopicId, mainTopicHeadingName, mainTopicVideoLevel } = req.body;

            //validate request payload
            const { error, value } = await updateMainTopiceHeadingValidation.validate(req.body, {
                abortEarly: false,
            });

            if (error) {
                // next(error.details[0].message)
                res.json({ status: STATUS_CODES.NOT_FOUND, message: error.details[0].message });
            }
            else {
                const data = await service.UpdateMainTopicHeading({ courseMinaTopicId, mainTopicHeadingName, mainTopicVideoLevel });
                return res.json(data);
            }
        } catch (error) {
            console.log("error.message >>>>>>", error)
            res.json({ status: 500, message: error });
        }
    });


    app.post("/student/course/course-sub-topic-heading", UserAuth, async (req, res, next) => {
        try {
            const { courseId, courseMainTopicId, subTopicHeadingName, subTopicLevel } = req.body;
            //validate request payload
            const { error, value } = await courseSubTopicesValidation.validate(req.body, {
                abortEarly: false,
            });

            if (error) {
                // next(error.details[0].message)
                res.json({ status: STATUS_CODES.NOT_FOUND, message: error.details[0].message });
            } else {
                const data = await service.CourseSubTopicHeading({ courseId, courseMainTopicId, subTopicHeadingName, subTopicLevel });
                return res.json(data);
            }
        } catch (error) {
            res.json({ status: STATUS_CODES.NOT_FOUND, message: error.message });
        }
    });

    
    //Get course sub topic heading
    app.get("/student/course/get-course-sub-topic-heading", UserAuth, async (req, res, next) => {
        try {
            //Destructure course sub topic heading id
            const { _id } = req.body;
            console.log("_id ==== ",_id);
            const { error, value } = await getTopiceHeadingValidation.validate(req.body, {
                abortEarly: false,
            });

            if (error) {
                // next(error.details[0].message)
                res.json({ status: STATUS_CODES.NOT_FOUND, message: error.details[0].message });
            }
            else {
                const data = await service.GetSingleSubTopic({ _id });
                return res.json(data);
            }
        } catch (error) {
            console.log("error.message >>>>>>", error)
            res.json({ status: 500, message: error });
        }
    });

    //Get all course sub heading 
    app.get("/student/course/get-all-course-sub-topic-heading", UserAuth, async (req, res, next) => {
        try {
                const data = await service.GetAllSubTopicHeading();
                return res.json(data);
        } catch (error) {
            console.log("error.message >>>>>>", error)
            res.json({ status: 500, message: error });
        }
    });

    //Delete sub topic topic
    app.delete("/student/course/delete-course-sub-topic-heading", UserAuth, async (req, res, next) => {
        try {
            const { _id } = req.body;

            const { error, value } = await deleteTopiceHeadingValidation.validate(req.body, {
                abortEarly: false,
            });

            if (error) {
                // next(error.details[0].message)
                res.json({ status: STATUS_CODES.NOT_FOUND, message: error.details[0].message });
            }
            else {
                const data = await service.DeleteSubTopicHeading({ _id });
                return res.json(data);
            }
        } catch (error) {
            console.log("error.message >>>>>>", error)
            res.json({ status: 500, message: error });
        }
    });

    //Update course sub topic heading
    app.put("/student/course/update-course-sub-topic-heading", UserAuth, upload.single('subTopicVideo'), async (req, res, next) => {
        try {
            const { courseSubTopicId, subTopicHeadingName, subTopicVideoLevel } = req.body;

            //validate request payload
            const { error, value } = await updateSubTopiceVideoValidation.validate(req.body, {
                abortEarly: false,
            });

            if (error) {
                // next(error.details[0].message)
                res.json({ status: STATUS_CODES.NOT_FOUND, message: error.details[0].message });
            }
            else {
                const data = await service.UpdateSubTopicHeading({  courseSubTopicId, subTopicHeadingName, subTopicVideoLevel });
                return res.json(data);
            }
        } catch (error) {
            console.log("error.message >>>>>>", error)
            res.json({ status: 500, message: error });
        }
    });

    //Create course subtopic video content
    app.post("/student/course/course-sub-topic-video", UserAuth, upload.single('subTopicVideo'), async (req, res, next) => {
        try {
            const { courseId, courseMainTopicId, courseSubTopicId, videoHeading, subTopicVideoLevel } = req.body;
            let image = req.file !== undefined ? req.file.originalname : null;

            // let subTopicVideo = null;
            req.body.subTopicVideo = image;
            const { subTopicVideo } = req.body;

            console.log("req.body ======= ", req.body, req.file, subTopicVideo);
            //validate request payload
            const { error, value } = await courseSubTopiceVideoValidation.validate(req.body, {
                abortEarly: false,
            });

            if (error) {
                // next(error.details[0].message)
                res.json({ status: STATUS_CODES.NOT_FOUND, message: error.details[0].message });
            }
            else {
                const data = await service.CourseSubTopicVideo({ courseId, courseMainTopicId, courseSubTopicId, videoHeading, subTopicVideo, subTopicVideoLevel });
                return res.json(data);
            }
        } catch (error) {
            console.log("error.message >>>>>>", error)
            res.json({ status: 500, message: error });
        }
    });

    //Get single subtopic video data
    app.get("/student/course/get-course-sub-topic-video", UserAuth, async (req, res, next) => {
        try {
            const { courseSubTopicId } = req.body;
            console.log("courseSubTopicId ==== ",courseSubTopicId);
            const { error, value } = await getSingleSubTopiceVideoDataValidation.validate(req.body, {
                abortEarly: false,
            });

            if (error) {
                // next(error.details[0].message)
                res.json({ status: STATUS_CODES.NOT_FOUND, message: error.details[0].message });
            }
            else {
                const data = await service.GetSingleSubTopicVideoContent({ courseSubTopicId });
                return res.json(data);
            }
        } catch (error) {
            console.log("error.message >>>>>>", error)
            res.json({ status: 500, message: error });
        }
    });

    //Get single subtopic video data
    app.get("/student/course/get-all-course-sub-topic-video", UserAuth, async (req, res, next) => {
        try {
                const data = await service.GetAllSubTopicVideoContent();
                return res.json(data);
        } catch (error) {
            console.log("error.message >>>>>>", error)
            res.json({ status: 500, message: error });
        }
    });

    //Delete single subtopic video data
    app.delete("/student/course/delete-course-sub-topic-video", UserAuth, async (req, res, next) => {
        try {
            const { courseSubTopicId } = req.body;

            const { error, value } = await deleteSubTopiceVideoDataValidation.validate(req.body, {
                abortEarly: false,
            });

            if (error) {
                // next(error.details[0].message)
                res.json({ status: STATUS_CODES.NOT_FOUND, message: error.details[0].message });
            }
            else {
                const data = await service.DeleteSubTopicVideoContent({ courseSubTopicId });
                return res.json(data);
            }
        } catch (error) {
            console.log("error.message >>>>>>", error)
            res.json({ status: 500, message: error });
        }
    });

    //Update course subtopic video content
    app.put("/student/course/update-course-sub-topic-video", UserAuth, upload.single('subTopicVideo'), async (req, res, next) => {
        try {
            const { courseSubTopicId, videoHeading, subTopicVideoLevel } = req.body;
            let image = req.file !== undefined ? req.file.originalname : null;

            // let subTopicVideo = null;
            req.body.subTopicVideo = image;
            const { subTopicVideo } = req.body;

            //validate request payload
            const { error, value } = await updateSubTopiceVideoValidation.validate(req.body, {
                abortEarly: false,
            });

            if (error) {
                // next(error.details[0].message)
                res.json({ status: STATUS_CODES.NOT_FOUND, message: error.details[0].message });
            }
            else {
                const data = await service.UpdateSubTopicVideo({ courseSubTopicId, videoHeading, subTopicVideo, subTopicVideoLevel });
                return res.json(data);
            }
        } catch (error) {
            console.log("error.message >>>>>>", error)
            res.json({ status: 500, message: error });
        }
    });



};
