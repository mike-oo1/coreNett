const commentModel =require("../models/commentsModel")
const writerModel= require("../models/writerModel")

exports.newComment = async (req, res)=>{
    try {
        const comments= await commentModel.findById(req.params.id,{new:true})
        const commentReference = await writerModel.create(req.body)
        comments.writer = comments
        commentReference.save()
        comments.save()
        res.status(200).json({
            message: 'comment created',
            data: commentReference
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}
exports.getAllComments= async(req,res)=>{
    try{
        const getAll = await commentModel.find()
        if(!getAll){
            return res.status(404).json({
                message:"no comments found"
            })
        }else{
            return res.status(201).json({
                message:"here are all coments made by the writer",
                data:getAll
            })
        }
    }catch(error){
        res.status(500).json({
            message: error.message
        })
    }
}

exports.getOneComment = async(req,res)=>{
    try {
        const id = req.params.id
        const getOne = await commentModel.findById(id)
        if(!getOne){
            return res.status(404).json({
                message:`the comment with id ${id} is not found`
            })
        }else{
            return res.status(200).json({
                message:`her is the writer comment wit id ${id}`
            })
        }
        
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
  
}

exports.updateComment = async(req,res)=>{
    try {
        const updateComment= await commentModel.findByIdAndUpdate(req.params.id,req.body,{new:true})
        if(!updateComment){
            return res.status(400).json({
                message:"cannot updaate this comment"
            })
        }else{
            return res.status(201).json({
                message:"this comment has been updated",
                data:updateComment
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}


exports.deleteComment = async(req,res)=>{
    try {
        const writerId = req.params.id
        const writer =await writerModel.findById(writerId)
        const deletCommentId = await commentModel.findByIdAndDelete(req.params.id,deletCommentIdcommentId)
        await writer.comment.push(deletCommentId)
        await writer.save()
        if(!deletCommentId){
            return res.status(400).json({
                message:`the comment with id ${deletCommentId} couldnt be deleted `
            })
        }else{
            return res.status(200).json({
                message:`the comment with id ${deletCommentId} has been deleted successfuly`,
                data:{null:true}
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}
