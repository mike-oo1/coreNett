// const jwt = require("jsonwebtoken");
const editorModel = require("../models/editorModel");

// // to authenticate a user token in the database

// const authentication = async (req, res, next) => {
//     try{
//     const editorId = req.params.adminId;
//     const editor = await editorModel.findById(userId);
//     const editorToken = user.token

//         if(!editorToken){
//             return res.status(400).json({
//                 message: `Token not found`
//             })
//         }

//         await jwt.verify(editorToken, process.env.secretKey, (err, payLoad) => {

//             if(err){
//                 return res.json(err.message)
//             }else{
//                 req.user = payLoad,
//                 next()
//             }
//         })
//     }catch(e){
//         res.status(500).json({
//             error: e.message
//         })
//     }
// }

// const authenticate = async (req, res, next) => {
//     try{
//         const id = req.params.editorId
//     const editor = await editorModel.findById(id);
//     console.log(editor)
//     const editorToken = editor.token

//         if(!editorToken){
//             return res.status(400).json({
//                 message: `No Authorization found`
//             })
//         }

//         await jwt.verify(editorToken, process.env.secretKey, (err, payLoad) => {

//             if(err){
//                 return res.json(err.message)
//             }else{
//                 req.user = payLoad,
//                 console.log(req.user)
//                 next()
//             }
//         })
//     }catch(e){
//         res.status(500).json({
//             error: e.message
//         })
//     }
// }

// // Another method to authorize

// const checkUser = (req, res, next) => {
//     authentication(req, res, async () => {
//         if(req.user.isAdmin || req.user.isSuperAdmin){
//             next()
//         }else{
//             res.status(400).json({
//                 message: `Not authorized to perform this action`
//             })
//         }
//     })
// }

// // super admin authorization

// const superAdminAuth = (req, res, next) => {
//     authentication(req, res, async() => {
//         if(req.user.isSuperAdmin){
//             next()
//         }else{
//             res.status(400).json({
//                 message:`You are not authorized to perform this action`
//             })
//         }
//     })
// }

// module.exports = {
//     checkUser,
//     authenticate,
//     superAdminAuth

// }

const jwt = require("jsonwebtoken")
// const User = require("../Models/model")
const dotenv = require("dotenv")
dotenv.config()

const userAuth = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
        const hasAuthorization = req.headers.authorization
      const token = hasAuthorization.split(" ")[1]

      const decodedToken = await jwt.verify(token, process.env.JWT_TOKEN);
      console.log(decodedToken)
      req.user = JSON.stringify(decodedToken)
      req.userId = decodedToken.userId
     
      next()
    } else {
      res.status(404).json({
        message: "No authorization found",
      })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const isEditorAuthorized = async (req, res, next) => {
  try {
console.log(req.userId)
    const user = await user.findById(req.userId)
    console.log(user)
    if (user.isAdminAuthorized) {
      next()
    } else {
      res.status(401).json({ message: "not an editor" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const isSuperAdminAuthorized = async (req, res, next) => {
  try {
    const user = await user.findById(req.userId);
    if (user.isSuperAdmin) {
      next()
    } else {
      res.status(401).json({ message: "not a super admin" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { userAuth, isEditorAuthorized, isSuperAdminAuthorized}