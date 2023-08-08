// declaring all the available modules

const express = require("express");
const router = express.Router()

const { createWriter, signOut, verifyWriterEmail, resendVerificationWriterEmail, changePassword, resetPassword, forgotPassword, userLogin, } = require('../controllers/writerController')
const upload = require("../utils/multer")


router.route("/createwriter").post( createWriter )
router.route("/log-in").post( userLogin )
router.route("/sign-out/:id").post(signOut)
router.route("/verify-emailadd/:token").get(verifyWriterEmail)
router.route('/resend-email').post(resendVerificationWriterEmail)
router.route("/change-pass/:token").post(changePassword)
router.route('/reset-pass/:token').post(resetPassword)
router.route("/forgot-pass/:token").post(forgotPassword)



module.exports = router