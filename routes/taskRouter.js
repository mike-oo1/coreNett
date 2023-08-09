const express = require("express")
const{newTask,assignTask,getAllTasks,getOneTask,updateTask,deleteTask,}=require("../controllers/taskController")
const Router =express()

Router.route("/newTask/:id").put(newTask)
// Router.route("/accept/:id").post(acceptTask)
Router.route("/accepts/:id").post(assignTask)
Router.route("/getalltasks").get(getAllTasks)
Router.route("/getonetask/:id").get(getOneTask)
Router.route("/updatetask/:id").put(updateTask)
Router.route("/deletetask/:id").delete(deleteTask)

// Router.route("/accepts").post(acceptTask)

module.exports=Router