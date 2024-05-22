const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseMainTopicsSchema = new Schema({
    courseId : {
        type: String, 
        required : true
    },
    topicHeadingName : {
        type:String,
        required : true
    },
    topicLevel : {
        type:Number,
        required : true
    },
    createdAt : {
        type : Date,
        required : true,
        default : Date.now
    },
    updatedAt : {
        type : Date,
        required : true,
        default : Date.now
    }
});


module.exports =  mongoose.model('CourseMainTopic', CourseMainTopicsSchema);