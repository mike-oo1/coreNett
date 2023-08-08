const express = require("express")
const{newTask,assignTask,acceptTask}=require("../controllers/taskController")
const Router =express()

Router.route("/newTask/:id").put(newTask)
Router.route("/accept/:id").post(assignTask)
// Router.route("/accepts").post(acceptTask)

module.exports=Router