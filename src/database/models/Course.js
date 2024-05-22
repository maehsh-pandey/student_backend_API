const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    courseName : {
        type:String,
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


module.exports =  mongoose.model('Course', CourseSchema);