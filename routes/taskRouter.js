const express = require("express")
const{createTask,acceptTask,getOneTask,updateTask,deleteTask}=require("../controllers/taskController")
const Router =express()


Router.route("/:id/createTask/:writerId").post(createTask)
Router.route("/:id/acceptTask/:taskId").post(acceptTask)
Router.route("/getOneTask/:taskId").get(getOneTask)
Router.route("/:writerId/update/:taskId").put(updateTask)
Router.route("/:writerId/delete/:taskId").put(deleteTask)

module.exports=Router