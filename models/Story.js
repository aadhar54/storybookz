const mongoose = require('mongoose')

const StorySchema = new mongoose.Schema({
    //These all things will be returned to us after login and we are storing them
    title: {
        type:String ,
        required:true,
        trim:true
    },
    body: {
        type:String ,
        required:true
    },
    status: {
        type:String ,
        required:true,
        default:'public',
        enum: ['public','private']
    },
    user: {
        type:mongoose.Schema.Types.ObjectId ,
        ref:'User'
    },
    createdAt: {
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('Story',StorySchema)