const { StudentModel,AddressModel,CourseModel,CourseMainTopics,CourseSubTopics } = require('../models');
const { APIError, BadRequestError, STATUS_CODES } = require('../../utils/app-errors')

//Dealing with data base operations
class StudentRepository {

    async CreateStudent({ email, password, phone, salt,occupation,systemIpAddress,image,role }){
        try{
            console.log("originalname >>>>",image);
            // let image = originalname;
            const student = new StudentModel({
                email,
                password,
                salt,
                occupation,
                systemIpAddress,
                phone,
                image,
                role,
                address: []
            })
            const studentResult = await student.save();
            return studentResult;
        }catch(error){
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message }); 

            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Create Customer')
        }
    }

    async ChangePassword({ userId,password, salt }){
        try{
            // const student = new StudentModel({
            //     password,
            //     salt,
            // })
            console.log("StudentModel>>>>>>>",userId,password,salt);
            // const studentResult = await StudentModel.findOneAndUpdate({_id:userId},{$set:{password:password,salt : salt}});
            const studentResult = await StudentModel.findOneAndUpdate({_id:userId},{$set:{password:password,salt : salt}});

            console.log("studentResult124>>>>>>>",studentResult);

            return studentResult;
        }catch(error){
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message }); 

            // console.log("err >>>>>>>",err.message)
            // throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Update Password')
        }
    }

    
    async InsertToken({ userId,token }){
        try{
            // const student = new StudentModel({
            //     password,
            //     salt,
            // })
            const studentResult = await StudentModel.findOneAndUpdate({_id:userId},{$set:{token:token}});
            return studentResult;
        }catch(error){
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message }); 

            // console.log("err >>>>>>>",err.message)
            // throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Update Password')
        }
    }

    async CheckToken({token}){
        try{
            const existingToken = await StudentModel.findOne({token:token});
            console.log("existingToken======",existingToken)

            return existingToken;
        }catch(error){
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message }); 

             //throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, err.message)
        }
    }

    async updateStudentProfile({ userId,email, password, phone, occupation, systemIpAddress,image }){
        try{
           
            console.log("updateStudentModel>>>>>>>",userId,email, password, phone, occupation, systemIpAddress,image );
            // const studentResult = await StudentModel.findOneAndUpdate({_id:userId},{$set:{password:password,salt : salt}});
            const studentResult = await StudentModel.findOneAndUpdate({_id:userId},{$set:{email:email, password:password, phone:phone, occupation:occupation, systemIpAddress:systemIpAddress,image:image}});

            console.log("studentResult124>>>>>>>",studentResult);

            return studentResult;
        }catch(error){
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message }); 

            // console.log("err >>>>>>>",err.message)
            // throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Update Password')
        }
    }

    
    async CreateAddress({ _id, street, postalCode, city, country}){
        
        try{
            const profile = await StudentModel.findById(_id);
            
            if(profile){
                
                const newAddress = new AddressModel({
                    street,
                    postalCode,
                    city,
                    country
                })
    
                await newAddress.save();
    
                profile.address.push(newAddress);
            }
    
            return await profile.save();

        }catch(err){
            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Error on Create Address')
        }
    }

    async FindCustomer(userData){
        try{
            console.log("userData>>>>",userData)
            const existingCustomer = await StudentModel.findOne(userData);
            return existingCustomer;
        }catch(error){
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message }); 
            // throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Find Customer')
        }
    }

    async FindCustomerById({ id }){

        try {
            const existingCustomer = await StudentModel.findById(id)
            .populate('address')
            .populate('wishlist')
            .populate('orders')
            .populate('cart.product');
            return existingCustomer;
        } catch (err) {
            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Find Customer');
        }
    }

    //Delete student
    async RemoveStudent(userData){
        try{
            console.log("userData>>>>",userData);
            const existingCustomer = await StudentModel.deleteOne(userData);
            return existingCustomer;
        }catch(error){
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message }); 
            // throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Find Customer')
        }
    }


 /*Get all students*/
 async FindAllStudent(){
    try{
        const existingStudents = await StudentModel.find();
        return existingStudents;
    }catch(error){
        return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message }); 
        // throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Find Customer')
    }
}
    
    
    

    

}

module.exports = StudentRepository;