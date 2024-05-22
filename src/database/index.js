// database related modules
module.exports = {
    databaseConnection: require('../database/connection'),
    // ProductRepository: require('./repository/student-repository'),
    StudentRepository: require('../database/repository/student-respository'),
    CourseRepository: require('../database/repository/course-respository')
}