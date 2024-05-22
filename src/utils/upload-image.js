const multer = require('multer');
const path = require("path")
const { FormateData } = require('./index');

const { STATUS_CODES } = require('./index');

/*------------------------------------------
--------------------------------------------
image upload code using multer
--------------------------------------------
--------------------------------------------*/

function imageStorage(){
    try{
        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                console.log("req >>>",file)
                cb(null, path.join(__dirname, '../public/stdImages'),function(error,sucess){
                   if(error) throw error;
                });
            },
            filename: function (req, file, cb) {
                cb(null, Date.now() + '-' + file.originalname);
            }
        });

        return storage
    }catch(error){
        return FormateData({ status: STATUS_CODES.INTERNAL_ERROR, message: error.message });

    }
    
    
}

// const upload = multer({ dest: 'public/userImages/' })

var upload = multer({ storage: imageStorage() });

module.exports = { upload }

