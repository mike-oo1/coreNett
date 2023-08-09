const taskModel = require("../models/taskModel")
const writerModel =require("../models/writerModel")
const nodemailer=require("nodemailer")
const {sendEmail}=require("./email")

exports.assignTask=async(req,res)=>{
    try {
       const {Title,Description}= req.body
        const writerId = req.params.id
        const getWriterid = await writerModel.findById(writerId)
        console.log(getWriterid);
        const data ={
            editor: req.user._id,
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
exports.newTask=async(req,res)=>{
    try {
        const newTask = await writerModel.findById(req.params.id)
        const Task= await taskModel.create(req.body)
        Task.link =newTask
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
        const findWriter =await writerModel.findById(id)
        const task = await taskModel.findById(taskid)
        if(!findWriter){
            return res.status(400).json({
                message:"no writer found"
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
        const writerId = req.params.id
        const taskId =req.params.taskId
        const getWriter = await writerModel.findById(writerId)
        const updateTask = await writerModel.findByIdAndUpdate(taskId,(req.body),{new:true})
        if(!getWriter){
            return res.status(404).json({
                message:"cannot find the writer with this id"
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
        const writerId = req.params.id
        const taskId =req.params.taskId
        const getWriter = await writerModel.findById(writerId)
        const deleteTask = await writerModel.findByIdAndDelete(taskId,(req.body))
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