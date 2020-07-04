const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    //These all things will be returned to us after login and we are storing them
    googleId: {
        type:String ,
        required:true
    },
    displayName: {
        type:String ,
        required:true
    },
    firstName: {
        type:String ,
        required:true
    },
    lastName: {
        type:String ,
        required:true
    },
    image: {
        type:String 
    },
    createdAt: {
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('User',UserSchema)