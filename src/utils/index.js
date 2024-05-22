const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { APP_SECRET } = require("../config");

//Utility functions
module.exports.GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

module.exports.GeneratePassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

module.exports.ValidatePassword = async (
  enteredPassword,
  savedPassword,
  salt
) => {
  console.log("validatePassword >>>>>>",await this.GeneratePassword(enteredPassword, salt) === savedPassword)
  return (await this.GeneratePassword(enteredPassword, salt)) === savedPassword;
};

module.exports.GenerateSignature = async (payload) => {
  try {
    return await jwt.sign(payload, APP_SECRET, { expiresIn: "30d" });
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports.RenewGenerateSignature = async (payload,NEW_APP_SECRET) => {
  try {
    return await jwt.sign(payload, NEW_APP_SECRET, { expiresIn: "30d" });
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports.ValidateSignature = async (req) => {
  try {
    const signature = req.get("Authorization");
    console.log("signature>>>>>>>>>>>>",signature,"================",signature.split(" ")[1]);
    const payload = await jwt.verify(signature.split(" ")[1], APP_SECRET);
    req.user = payload;
    console.log("req.user>>>>>>>>>>>>",req.user);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports.FormateData = (data) => {
  console.log("data>>>>>>>>>>>>FormateData>>>>>>",data);

  if (data) {
    console.log("data>>>>>>>>>>>>FormateData123456>>>>>>",data);
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};
