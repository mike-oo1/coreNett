const taskModel = require("../models/taskModel")
const editorModel =require("../models/writerModel")
const nodemailer=require("nodemailer")
const {sendEmail}=require("./email")


exports.assignTask=async(req,res)=>{
    try {
       const {Title,Description}= req.body
        const writerId = req.params.id
        const getWriterid = await writerModel.findById(writerId)
        console.log(getWriterid);
        const data ={
            editor: req.userId._id,
            writer:writerId,
            Title,
            Description
        }
        const taskCreate= await taskModel.create(data)
        if(!taskCreate){
            return res.status(400).json({
                message:"cannot assign task"
            })
        }else{
            console.log(getWriterid.Email);

                const mailOptions = {
                    // from: process.env.user,
                    to: getWriterid.Email,
                    subject: "Verify your account",
                  text: `Please click on the link to verify your email: <a href="${req.protocol}://${req.get("host")}/api/accept">Accept Task</a>`,
                }
                sendEmail( mailOptions );
                  return res.status(200).json({
                    message:"task assigned succesfully",
                    data:taskCreate
                  })
        }
    } catch (error) {
       return res.status(500).json({
            message:error.message
        })
    }
}

// exports.statusTrack = async(req,res)=>{

//     try {
//         const timer =req.body.timer
//             const timeModel =await taskModel.findByIdAndUpdate({isActive:true},{new:true})
//            return setTimeout(() => {
//                 res.status(200).json({
//                     message:"youre active",
//                     data:timeModel
//                 })
//             }, timer);

//     } catch (error) {
//         return res.status(500).json({
//             message:error.message
//         })
//     }


// }

exports.newTask=async(req,res)=>{
    try {
        const newTask = await editorModel.findById(req.params.id)
        const Task= await taskModel.create(req.body)
        Task.editor =newTask
        Task.save()
        newTask.push(Task)
        return res.status(200).json({
            message:"created",
            data:Task
        })
        
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}
exports.getAllTasks= async(req,res)=>{
    try {
        const checkAvailableTasks= await taskModel.find()
    if(!checkAvailableTasks){
        return res.status(404).json({
            message:"there are no available tasks"
        })
    }else{
        const allTasks= await taskModel.find()
        return res.status(200).json({
            message:"here are all tasks",
            data:allTasks
        })
    }
        
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}
exports.getOneTask = async(req,res)=>{
    try {
        const id = req.params.id
        const taskid=req.params.id
        const findeditor =await editorModel.findById(id)
        const task = await taskModel.findById(taskid)
        if(!findeditor){
            return res.status(400).json({
                message:"no editor found"
            })
        }else{
            return res.status(200).json({
                message:`here is the task with id $${taskid} `,
                data:task
            })
        }
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
}

exports.updateTask= async(req,res)=>{
    try {
        const editorId = req.params.id
        const taskId =req.params.taskId
        const geteditor = await editorModel.findById(editorId)
        const updateTask = await taskModel.findByIdAndUpdate(taskId,(req.body),{new:true})
        if(!geteditor){
            return res.status(404).json({
                message:"cannot find the editor with this id"
            })
        }else if(updateTask ==0){
            const message ="you didnt update anything"
            return res.status(200).json({
                message:"task updated successfully",
                data:updateTask,
                message:message
            })
        }
    }catch(error){
        return res.status(500).json({
            message:error.message
        })

    }
}
exports.deleteTask =async(req,res)=>{
    try {
        const editorId = req.params.id
        const taskId =req.params.taskId
        const geteditor = await editorModel.findById(editorId)
        const deleteTask = await taskModel.findByIdAndDelete(taskId,(req.body))
        if(!deleteTask){
            return res.status(400).json({
                message:"cannot delete this task"
            })
        }else{
            return res.status(200).json({
                message:"task deleted successfully",
                data:deleteTask
            })
        }  
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })

    }
}