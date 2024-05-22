const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Topic sub heading
// Main_topic_id
// Sub_topic_name
// Sub_topic_Level
const CourseSubTopicsSchema = new Schema({
    courseId: {
        type: String,
        require: true
    },
    courseMainTopicId: {
        type: String,
        require: true
    },
    subTopicHeadingName: {
        type: String,
        required: true
    },
    subTopicLevel: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});


module.exports = mongoose.model('CourseSubTopic', CourseSubTopicsSchema);