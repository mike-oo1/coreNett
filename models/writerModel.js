// call the needed modules

const mongoose = require("mongoose");

// new mongoose schema

const writerSchema = new mongoose.Schema({
    FullName: {
        type: String,
        required: true
    },
    UserName: {
        type: String,
        required: true,
        unique: true
    },
    Email: {
       type: String,
       required: true,
       unique: true
    },
    Password: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    ProfileImage: {
        type: String,

    },
    createdBy: {
        type: mongoose.SchemaTypes.ObjectId, 
        ref: 'Editors'
    },
    task:[{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Tasks"
    }],
    comment: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Comments"
    }],
    token: {
        type: String
    }

}, {timestamps: true})

const writerModel = mongoose.model ("Writers", writerSchema)

module.exports = writerModel
