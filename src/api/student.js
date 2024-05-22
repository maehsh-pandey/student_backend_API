const StudentService = require("../services/student-service");
const UserAuth = require("../api/middlewares/auth");
const isLogout = require("../api/middlewares/isLogout");
const { 
  signUpValidationSchema, 
  signValidationSchema, 
  forgotPasswordValidationSchema, 
  changePasswordValidationSchema, 
  resetPasswordValidationSchema,
  updateProfileValidationSchema 
} = require("../validator/studentModelValidator");
const { FormateData } = require('../utils');
const {systemIp}  = require("../utils/system-ip")

var requestIp = require('request-ip');
const IP = require('ip');
const { STATUS_CODES } = require("../utils/app-errors");
const { upload } = require("../utils/upload-image");

module.exports = (app) => {
  const service = new StudentService();

  app.post("/student/signup",upload.single('image'), async (req, res, next) => {
    try {
      var clientIp = requestIp.getClientIp(req);
      req.body.systemIpAddress = IP.address();
      // req.body.systemIpAddress = requestIp.getClientIp(req);

      console.log("req.file >>>>>",req.file,req.body)

      const { email, password, phone, occupation, systemIpAddress,role } = req.body;

      let image = req.file !== undefined ? req.file.originalname : null;
      //validate request payload
      const { error, value } = await signUpValidationSchema.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        // next(error.details[0].message)
        res.json({ status: STATUS_CODES.NOT_FOUND, message: error.details[0].message });
      } else {
        const { data } = await service.SignUp({ email, password, phone, occupation, systemIpAddress,image,role });
        return res.json(data);
      }
    } catch (error) {
      
      res.json({ status: STATUS_CODES.NOT_FOUND, message: error.message });
    }
  });

  app.post("/student/login", async (req, res, next) => {
    try {
      const { email, password } = req.body;
      var clientIp = requestIp.getClientIp(req);
      const ipAddress = IP.address();

      console.log("const ipAddress = req.ip;>>>>>>>>", ipAddress);
      //validate request payload
      const { error, value } = await signValidationSchema.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        // next(error.details[0].message)
        return res.json({ status: STATUS_CODES.NOT_FOUND, message: error.details[0].message });
      }

      const { data } = await service.SignIn({ email, password,session : req.session });
      console.log("logn ?>?ljkjkjk>>>>>", data)
      return res.json(data);
    } catch (error) {
      return res.json({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });
      // next(error);
    }
  });

  app.post("/student/change-password",isLogout, UserAuth, async (req, res, next) => {
    try {
      const { userId, oldPassword, password } = req.body;
      var clientIp = requestIp.getClientIp(req);
      const ipAddress = IP.address();
      //validate request payload
      const { error, value } = await changePasswordValidationSchema.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        // next(error.details[0].message)
        res.json({ status: STATUS_CODES.NOT_FOUND, message: error.details[0].message });
      }

      console.log("const ipAddress = req.ip;>>>>>>>>", ipAddress, req.ip, "req.body======", req.body);

      const { data } = await service.ChangePassword({ userId, oldPassword, password });

      return res.json(data);
    } catch (error) {
      return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });
      next(error);
    }
  });

  app.post("/student/forgot-password",isLogout, UserAuth, async (req, res, next) => {
    try {
      const { email } = req.body;
      console.log("email ::::::::::", email)
      var clientIp = requestIp.getClientIp(req);
      const ipAddress = IP.address();
      //validate request payload
      const { error, value } = await forgotPasswordValidationSchema.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        // next(error.details[0].message)
        res.json({ status: STATUS_CODES.NOT_FOUND, message: error.details[0].message });
      }

      const data = await service.ForgotPassword({ email });

      return res.json(data);
    } catch (error) {
      return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });
      // console.log("student forgot password route:::::::", error.message);
      // next(error);
    }
  });

  app.post("/student/reset-password",UserAuth, async (req, res, next) => {
    try {
      const { token } = req.query;
      const { password } = req.body;

      //validate request payload
      const { error, value } = await resetPasswordValidationSchema.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        // next(error.details[0].message)
        res.json({ status: STATUS_CODES.NOT_FOUND, message: error.details[0].message });
      }
      const data = await service.ResetPassword({ token, password });

      return res.json(data);
    } catch (error) {
      return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });
      console.log("student forgot password route:::::::", error.message);
      next(error);
    }
  });

  app.post("/student/refresh-token", async (req, res, next) => {
    try {
      const { userId } = req.body;

      console.log("userId >>>>>>>>", userId);

      const data = await service.RefreshToken({ userId });

      return res.json(data);
    } catch (error) {
      return FormateData({ status : STATUS_CODES.INTERNAL_ERROR, message : error.message });
      next(error);
    }
  });

  app.post("/student/logout", async (req, res, next) => {
    try {
      // const { email, password } = req.body;
      var clientIp = requestIp.getClientIp(req);
      const ipAddress = IP.address();


      console.log("const ipAddress = req.ip;>>>>>>>>", ipAddress, req.session);
      req.session.destroy();

      // const { data } = await service.SignIn({ email, password });

      return res.json({status:200, message : "Student logout successfully."});
    } catch (error) {
      return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });
      next(error);
    }
  });

  app.put("/student/update-profile",UserAuth,upload.single('image'),async (req, res, next)=>{
    try {
      const { userId,email, password, phone, occupation } = req.body;
      let image = req.file !== undefined ? req.file.originalname : null;

      let systemIpAddress = await systemIp(req);
      req.body.systemIpAddress = systemIpAddress;
      console.log("systemIpAddress ==",req.body,req.file);

      console.log("userId >>>>>>>>", userId);

        //validate request payload
        const { error, value } = await updateProfileValidationSchema.validate(req.body, {
          abortEarly: false,
        });
  
        if (error) {
          res.json({ status: STATUS_CODES.NOT_FOUND, message: error.details[0].message });
        } else {
          const data = await service.UpdateProfile({ userId,email, password, phone, occupation, systemIpAddress,image });
          return res.json(data);
        }
    } catch (error) {
      return FormateData({ status : STATUS_CODES.INTERNAL_ERROR, message : error.message });
      next(error);
    }
  })

  app.post("/student/address", UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;

      const { street, postalCode, city, country } = req.body;

      const { data } = await service.AddNewAddress(_id, {
        street,
        postalCode,
        city,
        country,
      });

      return res.json(data);
    } catch (error) {
      return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });
      next(error);
    }
  });

  //Get single student data or edit single student
  app.get("/student/get-student/:id", UserAuth, async (req, res, next) => {
    try {
      console.log("req.params>>>",req.params);
      const { id } = req.params;
      const { data } = await service.GetSingleStudent(id);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  //Get all students data
  app.get("/student/get-all-student", UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { data } = await service.GetAllStudents();
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

    //Get single student data or edit single student
    app.delete("/student/delete-student/:id", UserAuth, async (req, res, next) => {
      try {
        console.log("req.params>>>>>",req.params);
        const { _id } = req.params;
        const { data } = await service.DeleteStudent(_id);
        return res.status(200).json(data);
      } catch (err) {
        next(err);
      }
    });


  app.get("/customer/profile", UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { data } = await service.GetProfile({ _id });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/customer/shoping-details", UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { data } = await service.GetShopingDetails(_id);

      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/customer/wishlist", UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { data } = await service.GetWishList(_id);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });
};
