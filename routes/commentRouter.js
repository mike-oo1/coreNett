const express =require("express")
const {newComment,getAllComments,getOneComment,updateComment,deleteComment}= require("../controllers/commentsController")
const Router = express()

Router.route("/newcomment/:id").put(newComment)
Router.route("/getAll").get(getAllComments)
Router.route("/getone/:id").get(getOneComment)
Router.route("/update/:id").put(updateComment)
Router.route("/delete/:id").delete(deleteComment)

module.exports = Router