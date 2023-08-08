const express = require("express")
const{newTask,assignTask,acceptTask,getAllTasks,getOneTask,updateTask,deleteTask}=require("../controllers/taskController")
const Router =express()

Router.route("/newTask/:id").put(newTask)
Router.route("/accept/:id").post(assignTask)
Router.route("/getall").get(getAllTasks)
Router.route("/getone/:id").get(getOneTask)
Router.route("/update/:id").put(updateTask)
Router.route("/delete/:id").delete(deleteTask)

// Router.route("/accepts").post(acceptTask)

module.exports=Router