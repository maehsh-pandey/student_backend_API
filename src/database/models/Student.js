const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    email: {
        type: String,
        unique : true 
    },
    password: String,
    salt: String,
    phone: String,
    occupation : String,
    systemIpAddress : String,
    image : {
        type : String,
        default: null
    },
    // address:[
    //     { type: Schema.Types.ObjectId, ref: 'address', require: true }
    // ],
    token:{
        type: String,
        default: null
    },
    role : {
        type:String,
        default:"USER",
        enum:["USER","ADMIN","SUPER_ADMIN"],
    },
    createAt : {
        type : Date,
        required : true,
        default : Date.now
    },
    updatedAt : {
        type : Date,
        required : true,
        default : Date.now
    }
    // cart: [
    //     {
    //       product: { type: Schema.Types.ObjectId, ref: 'product', require: true},
    //       unit: { type: Number, require: true}
    //     }
    // ],
    // wishlist:[
    //     { 
    //         type: Schema.Types.ObjectId, ref: 'product', require: true
    //     }
    // ],
    // orders: [ 
    //     { type: Schema.Types.ObjectId, ref: 'order', require: true }
    // ]
},{
    toJSON: {
        transform(doc, ret){
            delete ret.password;
            delete ret.salt;
            delete ret.__v;
        }
    },
    // timestamps: true

});

module.exports =  mongoose.model('student', StudentSchema);