const { StudentRepository } = require("../database");
const { FormateData, GeneratePassword, GenerateSalt, GenerateSignature,RenewGenerateSignature, ValidatePassword } = require('../utils');
const { APIError, BadRequestError, DataNotFoundError, STATUS_CODES } = require('../utils/app-errors')
const { sendMailToStudent } = require('../utils/node-mailer')
const { APP_SECRET } = require("../config");

const fs = require('fs');
const path  = require('path')
var randomstring = require("randomstring");


// All Business logic will be here
class CourseService {

    constructor() {
        this.repository = new StudentRepository();
    }

    async SignUp(userInputs) {

        const { email, password, phone, occupation, systemIpAddress,image,role } = userInputs;

        try {
            const existingStudent = await this.repository.FindCustomer({ email });

            if (existingStudent) {
                return FormateData({ status: 200, message: "Email Already Exist." });
            }
            // create salt
            let salt = await GenerateSalt();

            let userPassword = await GeneratePassword(password, salt);

            const existingCustomer = await this.repository.CreateStudent({ email, password: userPassword, phone, salt, occupation, systemIpAddress,image,role });

            const token = await GenerateSignature({ email: email, _id: existingCustomer._id });

            return FormateData({ id: existingCustomer._id, token });

        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });

            throw new APIError('Data Not found', error)
        }
    }

    async SignIn(userInputs) {

        const { email, password,session } = userInputs;

        try {


            const existingCustomer = await this.repository.FindCustomer({ email });

            if (existingCustomer) {
                const token = await GenerateSignature({ email: existingCustomer.email, _id: existingCustomer._id });
                const response = await this.repository.InsertToken({ userId: existingCustomer._id, token });
                const getStudentData = await this.repository.FindCustomer({ email });

                const validPassword = await ValidatePassword(password, existingCustomer.password, existingCustomer.salt);
                // console.log("existingCustomer>>>>>validPassword", getStudentData, "validPasswordvalidPassword", validPassword);
                //Set session
                session.userId = existingCustomer._id;
                console.log("login session = ",session)

                if (validPassword) {
                    return FormateData({ status: STATUS_CODES.OK, _id: getStudentData._id, token: getStudentData.token });
                } else {
                    return FormateData({ status: STATUS_CODES.NOT_FOUND, message: "Invalid email or password." })
                }
            }


            return FormateData({ status: STATUS_CODES.NOT_FOUND, message: "Invalid email or password." })

        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });

            console.log("error login catch>>>>>>", error.message);
            throw new APIError('Data Not found', error)
        }
    }

    async ChangePassword(userInputs) {
        const { userId, oldPassword, password } = userInputs;

        try {
            const existingStudent = await this.repository.FindCustomer({ _id: userId });

            if (existingStudent) {

                console.log("oldPassword", oldPassword, password);
                const validPassword = await ValidatePassword(oldPassword, existingStudent.password, existingStudent.salt);

                if (validPassword) {
                    // create salt
                    let salt = await GenerateSalt();
                    let userPassword = await GeneratePassword(password, salt);
                    console.log("password and salt>>>>>", password, salt, userId, password, userPassword);
                    const existingStudent = await this.repository.ChangePassword({ userId, password: userPassword, salt });

                    const token = await GenerateSignature({ email: existingStudent.email, _id: existingStudent._id });
                    return FormateData({ id: existingStudent._id, token });
                } else {
                    return FormateData({ status: false, Error: "Old Password Not Match." })
                    //    return throw new APIError('Data Not found', "Old Password Not Match.")
                }
            }

            return FormateData(null);

        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });

            console.log("service error", error.message)
            throw new APIError('Data Not found', error)
        }
    }

    async ForgotPassword(userInputs) {
        try {
            console.log("userInputs:::::::::::::", userInputs)
            if (userInputs) {
                //let response = await this.sendMailToStudent(userInputs);
                //Send mail to student
                const existingStudent = await this.repository.FindCustomer({ email: userInputs.email });

                if (existingStudent) {
                    let response = await sendMailToStudent(userInputs);
                    console.log("response ========", response);
                    return FormateData({ status: STATUS_CODES.Ok, message: response.message });

                } else {
                    return FormateData({ status: 200, message: "Invalid email. Please enter valid email." });

                }

            } else {
                console.log("Empty data ======", userInputs);
            }
        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });

            console.log("Forgot Password::::::::::", error.message)
        }
    }

    async ResetPassword(userInputs) {
        try {
            if (userInputs) {
                let response = await this.repository.CheckToken(userInputs);
                console.log("CHECK TOKEN =====", response, userInputs);
                if (response) {
                    let { _id, } = response;

                    let salt = await GenerateSalt();
                    let userPassword = await GeneratePassword(userInputs.password, salt);

                    let changePasswordResult = await this.repository.ChangePassword({ userId: _id, password: userPassword, salt })
                    return FormateData({ status: STATUS_CODES.OK, data: changePasswordResult, message: "Password change successfully." });
                } else {
                    return FormateData({ status: STATUS_CODES.OK, message: "Token has been expired." });
                }
            } else {
                return FormateData({ status: STATUS_CODES.NOT_FOUND, message: "DATA NOT FOUND." });
            }
        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });

            console.log("Forgot Password::::::::::", error.message)
        }
    }

    async RenewToken({_id,email}){
        try{
            const newSecretJwt = randomstring.generate();
            console.log("__dirname>>>",__dirname)

            fs.readFile(path.resolve(__dirname, '../config/index.js'),'utf-8',function(error,data){
                if(error){
                    throw error;
                }else{
                    const newValue = data.replace(new RegExp(APP_SECRET,"g"),newSecretJwt)
                    fs.writeFile(path.resolve(__dirname, '../config/index.js'),newValue,'utf-8',function(error,data){
                        if(error){
                            throw error;
                        }else{
                            console.log("writeFile successfully...");
                        }
                    })
                }
            })
            const token = await RenewGenerateSignature({email : email,_id : _id},APP_SECRET);
            // const token = await RenewGenerateSignature({payload:{ _id : _id, email : email },NEW_APP_SECRET:newSecretJwt});
            return token;
        }catch(error){
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });
        }
    }

    //Refresh Token
    async RefreshToken(userInputs) {
        try {


            const existingStudent = await this.repository.FindCustomer({ _id : userInputs.userId });
            if(existingStudent){
                // console.log("existingStudent >>>>>>",existingStudent)
                let token = await this.RenewToken({email : existingStudent.email,_id : existingStudent._id});
                return {_id : existingStudent._id,token : token};
            }
        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });
        }
    }

    async UpdateProfile(userInputs){
        

        try {
            const { userId,email, password, phone, occupation, systemIpAddress, image } = userInputs;



            const existingCustomer = await this.repository.updateStudentProfile({ userId,email, password, phone, occupation, systemIpAddress,image });


            return FormateData({ status: STATUS_CODES.OK, message : "Update profile successfully.",existingCustomer:existingCustomer });

        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });

            throw new APIError('Data Not found', error)
        }
    }

    async AddNewAddress(_id, userInputs) {

        const { street, postalCode, city, country } = userInputs;

        try {
            const addressResult = await this.repository.CreateAddress({ _id, street, postalCode, city, country })
            return FormateData(addressResult);
        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });
            throw new APIError('Data Not found', err)
        }
    }

    // async CheckToken(data) {

    //     try {
    //         const existingToken = await this.repository.FindCustomerById(data);
    //         return FormateData(existingToken);

    //     } catch (err) {
    //         throw new APIError('Data Not found', err)
    //     }
    // }

    async GetProfile(id) {

        try {
            const existingCustomer = await this.repository.FindCustomerById({ id });
            return FormateData(existingCustomer);

        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });
            throw new APIError('Data Not found', error)
        }
    }

    async GetSingleStudent(id) {
        try {
            console.log("getSingleStudent>>>>",id)
            const existingCustomer = await this.repository.FindCustomer({_id:id});
            return FormateData(existingCustomer);

        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });
            throw new APIError('Data Not found', error)
        }
    }

    async GetAllStudents(id) {

        try {
            const existingCustomer = await this.repository.FindAllStudent();
            
            return FormateData(existingCustomer);

        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });

            throw new APIError('Data Not found', error)
        }
    }

    async DeleteStudent(id) {
        try {
            console.log("getSingleStudent>>>>",id)
            const deletedStdStatus = await this.repository.RemoveStudent({_id:id});
            if (deletedStdStatus.deletedCount) {
                return FormateData({ status: 200, message: "Deleted User Successfully." });

            } else {
                return FormateData({ status: 400, message: "Something want wrong." });

            }
        } catch (error) {
            return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });
            throw new APIError('Data Not found', error)
        }
    }
    async GetShopingDetails(id) {

        try {
            const existingCustomer = await this.repository.FindCustomerById({ id });

            if (existingCustomer) {
                return FormateData(existingCustomer);
            }
            return FormateData({ msg: 'Error' });

        } catch (err) {
            throw new APIError('Data Not found', err)
        }
    }

    async GetWishList(customerId) {

        try {
            const wishListItems = await this.repository.Wishlist(customerId);
            return FormateData(wishListItems);
        } catch (error) {
            return FormateData({ status: STATUS_CODES.NOT_FOUND, message: error.message });

            throw new APIError('Data Not found', err)
        }
    }

    async AddToWishlist(customerId, product) {
        try {
            const wishlistResult = await this.repository.AddWishlistItem(customerId, product);
            return FormateData(wishlistResult);

        } catch (err) {
            throw new APIError('Data Not found', err)
        }
    }

    async ManageCart(customerId, product, qty, isRemove) {
        try {
            const cartResult = await this.repository.AddCartItem(customerId, product, qty, isRemove);
            return FormateData(cartResult);
        } catch (err) {
            throw new APIError('Data Not found', err)
        }
    }

    async ManageOrder(customerId, order) {
        try {
            const orderResult = await this.repository.AddOrderToProfile(customerId, order);
            return FormateData(orderResult);
        } catch (err) {

            throw new APIError('Data Not found', err)
        }
    }

    async SubscribeEvents(payload) {

        const { event, data } = payload;

        const { userId, product, order, qty } = data;

        switch (event) {
            case 'ADD_TO_WISHLIST':
            case 'REMOVE_FROM_WISHLIST':
                this.AddToWishlist(userId, product)
                break;
            case 'ADD_TO_CART':
                this.ManageCart(userId, product, qty, false);
                break;
            case 'REMOVE_FROM_CART':
                this.ManageCart(userId, product, qty, true);
                break;
            case 'CREATE_ORDER':
                this.ManageOrder(userId, order);
                break;
            default:
                break;
        }

    }

}

module.exports = CourseService;