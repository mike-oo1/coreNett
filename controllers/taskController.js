const taskModel = require("../models/taskModel")
const writerModel =require("../models/writerModel")
const nodemailer=require("nodemailer")
const sendmail=require("./email")



exports.assignTask=async(req,res)=>{
    try {
     
        const writerId = req.params.id
        const getWriterid = await writerModel.find({writerId})
        console.log(getWriterid);
        const data ={Email:req.body}
        console.log(data);
      
        // const getWriterEmail =getWriterid.Email
        // console.log(getWriterEmail);
        
       
        if(!getWriterid){
            return res.status(404).json({
                message:"couldnt find any writer "
            })
        }else{
            const checked = await new writerModel(data)
           
              const subject ="KINDLY ACCEPT YOUR TASK"
              const link =`${req.protocol}: //${req.get("host")}api/accept`
              const message =`click on this link${link} to accept your task`
              sendmail(
                {
                    from:"gmail",
                    email:checked.Email,
                    subject:`accecpt the task assigned`,
                    message:link
                }
            )

        await checked.save()
              return res.status(200).json({
                message:"task assigned succesfully",
                data:getWriterid
              })

        }
        
        
    } catch (error) {
       return res.status(500).json({
            message:error.message
        })
    }
}


// exports.acceptTask=async(req,res)=>{
//     try {
//         const Email = req.body
//         const subject ="KINDLY VERIFY BRO"
//         const link =`${req.protocol}: //${req.get("host")}/api/accepts`
//         const message =`click on this link${link} to verify, kindly note that this link will expire after 5 minutes`
        
//         // const acceptTask =await new writerModel(data)
//         mailsender(
//             {
//                 from:"gmail",
//                 email:Email,
//                 subject:`kindly verify`,
//                 message:link
//             }
//         )
        // await acceptTask.save()
        // const startTime = await  setTimeout(() => {
                // if(startTime.acceptTask <=setTimeout){
                //     return res.status(200).json({
                //         message:"task completed",
                //         data:{isComplete:true}
                //     })
                // }else if(startTime.acceptTask > setTimeout){
                //     return res.status(200).json({
                //         message:"task pending",
                //         data:{isPending:true}
                //     })
    
//                 }else if(startTime.acceptTask == startTime){
//                     return res.status(200).json({
//                         message:"Active",
//                         data:{isActive:true}
//                     })
//                 }
                
//             }, "2h");
    
          
        
//     } catch (error) {
//         return res.status(500).json({
//             message:error.message
//         })
//     }



// }
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
        const checkAvailableTasks= await taskModel.findOne({Task})
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
                message:"cannot delete"
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