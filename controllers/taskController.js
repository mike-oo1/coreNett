const taskModel = require("../models/taskModel")
const editorModel = require("../models/editorModel")
const writerModel =require("../models/writerModel")
const nodemailer=require("nodemailer")
const {sendEmail}=require("./email")

 exports.createTask =  async (req, res) => {
    try {
        const editorid = req.params.editorid
        const writerId = req.params.writerId
        const getEditor = await editorModel.findById(editorid)
        const getWriter = await writerModel.findById(writerId)
        if(!getEditor){
            return res.status(404).json({
                message: `no editor found with this ${id} `
            })
        }
        if(!getWriter){
            return res.status(404).json({
                message: `no writer found with tis id ${writerId}`
            })
        }
        const {Title,Description, timer} = req.body;
        const createdTask = new taskModel({
            Title,
            Description,
            editor: getEditor._id, 
            writer: getWriterriter._id,
            timer  
        })

        getEditor.task.push(newTask.id)
        getWriter.task.push(newTask.id)

        await getEditor.save()
        await getWriter.save()
        await createdTask.save()
        res.status(201).json({
            message: "Task has been created by the editor and it has been  assigned to the writer",
            data: createdTask
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

 exports.acceptTask = async (req, res) => {
  try {
      const taskId = req.params.taskId
   const task = await taskModel.findById(taskId)
   if (!task) {
    return res.status(404).json({
        message: "Task not found"
      })
     }
     const subject ="KINDLY ACCEPT THIS TASK"
     const link =`${req.protocol}: //${req.get("host")}/acceptTask`
     const text =`click on this link${link} to accept your task`
     sendEmail(
         {
             from:"gmail",
             email:task.Email,
             subject:`kindly accept`,
             text:link
         }
     )
     
     task.isActive = true
     await task.save()

     setTimeout(() => {
         if (task.isActive) {
             task.isActive = false
             task.isPending = true
             task.save();
         }
         if(task.isComplete){
             task.isActive = false
             task.isPending = false
             task.save()
         }
     }, task.timer)
     res.status(200).json({
         message: "Task accepted successfully",
         data: task
     })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.getOneTask = async(req,res)=>{
    try {
        const taskid=req.params.id
        const task = await taskModel.findById(taskid)
        if(!findeditor){
            return res.status(400).json({
                message:`task with id ${taskid} not found`
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

exports.updateTask = async (req, res) => {
    try{
        const writerId = req.params.writerId;
        const writer = await writerModel.findById(writerId)
        if(!writer) {
            return res.status(404).json({
                message: `writer with id ${writerId} not found`
            })
        }
        const taskId = req.params.taskId
        const task = await taskModel.findById(taskId)
        if(!task) {
            return res.status(404).json({
                message: `task with id ${taskId} not found`
            })
        }
        task.isComplete = true;
        await task.save()
       return res.status(200).json({
            message: "updated successfully",
            data: task
        })

    }catch(error){
        return  res.status(500).json({
          message: error.message
        })
      }
}
    
exports.deleteTask = async (req, res) => {
    try{
        const writerId = req.params.writerId;
        const writer = await writerModel.findById(writerId)
        if(!writer) {
            return res.status(404).json({
                message: `writer with id ${writerId} not found`
            })
        }
        const taskId = req.params.taskId
        const task = await taskModel.findByIdAndDelete(taskId)
        if(!task) {
            return res.status(404).json({
                message: `task with id ${taskId} not found`
            })
        }else{
            await task.save()
            return res.status(200).json({
                 message: "deleted successfully",
                 data: task
             })
        }
    }catch(error){
        return  res.status(500).json({
          message: error.message
        })
      }
}