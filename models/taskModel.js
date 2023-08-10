// call the needed modules

const mongoose = require("mongoose");

// new mongoose schema

const TaskSchema = new mongoose.Schema({
    Title: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    isActive: {
       type: Boolean,
       default: false
    },
    isPending: {
       type: Boolean,
       default: false
    },
    isComplete: {
       type: Boolean,
       default: false
    },
    editor: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Editors"
    },
    writer:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Writers"
},
timer:{
    type:Number,
    default: null
}
}, 
{
    timestamps: true
})

const taskModel = mongoose.model("Tasks", TaskSchema)

module.exports = taskModel


