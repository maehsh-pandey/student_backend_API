module.exports = async (req,res,next) => {
    console.log("logout session = ",req.session.userId);

    if(req.session.userId){
        console.log("session = ",req.session.userId);
        return next();
    }
    return res.status(403).json({message: 'Not Authorized!'})
}