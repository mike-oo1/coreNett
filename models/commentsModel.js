// call the needed modules

const mongoose = require("mongoose");

// new mongoose schema

const CommentSchema = new mongoose.Schema({
    comment: {
           type: String,
        required: true
    },
    editor: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Editors"
    },
    writer: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Writers"
}
}, 
{
    timestamps: true
})

const commentModel = mongoose.model("Comments", CommentSchema)

module.exports = commentModel


