const { ValidateSignature } = require('../../utils');

module.exports = async (req,res,next) => {
    
    const isAuthorized = await ValidateSignature(req);
    console.log("isAuthorized >>>>",isAuthorized);

    if(isAuthorized){
        return next();
    }
    return res.status(403).json({message: 'Not Authorized'})
}