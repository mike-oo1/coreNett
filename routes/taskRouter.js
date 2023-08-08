const express = require("express")
const{newTask,assignTask,acceptTask,getAllTasks,getOneTask}=require("../controllers/taskController")
const Router =express()

Router.route("/newTask/:id").put(newTask)
Router.route("/accept/:id").post(assignTask)
Router.route("/getall").get(getAllTasks)
Router.route("/getone/:id").get(getOneTask)

// Router.route("/accepts").post(acceptTask)

module.exports=Router