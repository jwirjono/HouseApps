const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    //every profile associated with user
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    company:{
        type: String
    },
    website:{
        type: String
    },
    location:{
        type:String
    },
    status:{
        type:String,
        required:true
    },
    skills:{
        type:[String],
        required:true
    },
    bio:{
        type:String
    },
    githubusername:{
        type:String
    },
    experience:[
        {
            title:{
                type:String,
                required:true
            },
            company:{
                type:String,
                required:true
            },
            location:{
                type:String
            },
            from:{
                type:Date,
                required:true
            },
            to:{
                type:Date
            },
            current:{
                type:Boolean,
                default:false
            },
            description:{
                type:String
            }
        }
    ]
});