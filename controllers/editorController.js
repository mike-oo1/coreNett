// calling the needed modules

require ("dotenv").config();
const editorModel = require("../models/editorModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
// const cloudinary = require('../utils/cloudinary');
// const validator = require('../middleware/editorValidation');
// const { default: isEmail } = require("validator/lib/isEmail");


// create a mailing function

const signup = async(req,res)=>{
  try {
      const {UserName,Email,Password,CompanyName,FirstName,Surname,}= req.body
      // hashing password
      const salt =bcrypt.genSaltSync(10)
      const hash = bcrypt.hashSync(Password,salt)
      // console.log(req.file)
      
      const data ={
          UserName,
          Email,
          Password:hash,
          CompanyName,
          FirstName,
          Surname,
          // profilePic:req.file.path
      }
      if(!UserName||!Email||!Password||CompanyName||!FirstName||!Surname){
          return "field cant be empty"
      }else{
        const createUser =await new editorModel(data)
        // generate the token
  
        const newToken = jwt.sign({
            UserName,
            Password
        },process.env.JWT_TOKEN,{expiresIn: "1d"})
        createUser.token = newToken
        const subject ="KINDLY VERIFY BRO"
        const link =`${req.protocol}: //${req.get("host")}/userverify${createUser._id}/${newToken}`
        const text =`click on this link${link} to verify, kindly note that this link will expire after 5 minutes`
        mailsender(
            {
                from:"gmail",
                email:createUser.Email,
                subject:`kindly verify`,
                text:link
            }
        )
        await createUser.save()
        res.status(200).json({
            message:"created",
            data:createUser
        })
  

      }
  } catch (error) {
      res.status(500).json({
          message:error.message
      })
      
  }

}

//login function

const userLogin = async (req, res) => {
  try {
    // Extract the username and password from the request body
    const { UserName, Password } = req.body;

    // Find the editor by their username
    const editor = await editorModel.findOne({ UserName });

    // Check if the editor exists
    if (!editor) {
      return res.status(404).json({
        message: `Username is not found`,
      });
    }

    // Compare the inputted password with the existing one using bcrypt.compare
    const checkPassword = bcrypt.compareSync(Password, editor.Password);

    // Check for password match
    if (!checkPassword) {
      return res.status(400).json({
        message: `Login Unsuccessful`,
        failed: `Invalid PASSWORD`,
      });
    }
    
    // // Check if user is verified
    // if (!editor.isVerified) {
    //   return res.status(404).json({
    //       message: `User with ${editor.Email} is not verified`,
    //   });
    // }

    // Generate a JWT token with the editor's ID and other information
    const token = jwt.sign(
      {
        id: editor._id,
        UserName: editor.UserName,
        Email: editor.Email,
      },
      process.env.secretKey,
      { expiresIn: "1d" }
    );

    // Save the token to the editor's document
    editor.token = token;
    await editor.save();

    // Return success response with token and editor's data
    res.status(200).json({
      message: `User logged in successfully`,
      data: {
        editorId: editor._id,
        UserName: editor.UserName,
        token: editor.token,
      },
    });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({
      message: error.message,
    });
  }
};

  
//   editor sign out
  const signOut = async (req, res) => {
    try {
        const id = req.params.id
        
        // update the user's token to null
        const editor = await editorModel.findByIdAndUpdate(id, {token: null}, {new: true})
        console.log(editor)
        if (!editor){
            return res.status(404).json({
                message: `Editor not found`
            })
        }
        res.status(200).json({
            message: `Editor logged out successfully`
        })
    }catch(e){
        res.status(500).json({
            error: e.message
        })
    }
};


// Forgot Password
const forgotPassword = async (req, res) => {
    try {
      const { Email } = req.body;
  
      // Check if the email exists in the userModel
      const editor = await editorModel.findOne({ Email: Email.toLowerCase() });
      if (!editor) {
        return res.status(404).json({
          message: "Editor not found"
        });
      }
  
      // Generate a reset token
      const resetToken = await jwt.sign({ editorId: editor._id }, process.env.secretKey, { expiresIn: "30m" });
  
      // Send reset password email
      const mailOptions = {
        from:  process.env.user,
        to: editor.Email,
        subject: "Password Reset",
        html: `Please click on the link to reset your password: <a href="${req.protocol}://${req.get("host")}/api/users/reset-password/${resetToken}">Reset Password</a>. This link expires in Thirty(30) minutes.`,
      };
  
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({
        message: "Password reset email sent successfully"
      });
    } catch (error) {
      console.error("Something went wrong", error.message);
      res.status(500).json({
        message: error.message
      });
    }
  };

  // Reset Password
const resetPassword = async (req, res) => {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;
  
      // Verify the editor's token
      const decodedToken = jwt.verify(token, process.env.secretKey);
  
      // Get the editor's ID from the token
      const editorId = decodedToken.id;
  
      // Find the editor by ID
      const editor = await editorModel.findById(editorId);
      if (!editor) {
        return res.status(404).json({
          message: "Editor not found"
        });
      }
  
      // Salt and hash the new password
      const saltedRound = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, saltedRound);
  
      // Update the editor's password
      editor.Password = hashedPassword;
      await editor.save();
  
      res.status(200).json({
        message: "Password reset successful"
      });
    } catch (error) {
      console.error("Something went wrong", error.message);
      res.status(500).json({
        message: error.message
      });
    }
  };

// Change Password
const changePassword = async (req, res) => {
    try {
      const { token } = req.params;
      const { newPassword, existingPassword } = req.body;
  
      // Verify the user's token
      const decodedToken = jwt.verify(token, process.env.secretKey);
  
      // Get the editor's Id from the token
      const editorId = decodedToken.id;
  
      // Find the editor by ID
      const editor = await editorModel.findById(editorId);
      if (!editor) {
        return res.status(404).json({
          message: "Editor not found"
        });
      }
  
      // Confirm the previous password
      const isPasswordMatch = await bcrypt.compare(existingPassword, editor.Password);
      if (!isPasswordMatch) {
        return res.status(401).json({
          message: "Existing password is incorrect."
        });
      }
  
      // Salt and hash the new password
      const saltedRound = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, saltedRound);
  
      // Update the user's password
      editor.Password = hashedPassword;
      await editor.save();
  
      res.status(200).json({
        message: "Password changed successful"
      });
    } catch (error) {
      console.error("Something went wrong", error.message);
      res.status(500).json({
        message: error.message
      });
    }
  };
  

// get all editors in the database
const getAllEditors = async (req, res) =>{
  try{
    const alleditors = await editorModel.find();
    if(alleditors.length === 0){
       res.status(404).json({
        message: `No Editors in the Database`
       })
    }else{
      res.status(200).json({
        message: `These are the available Editors in the Database, they are ${alleditors.length} in number`,
        data: alleditors
      })
    }

  }catch(error){
    res.status(500).json({
      message: error.message
    })
  }
}

// get one editor from the database

const getOneEditor = async (req, res) => {
  try{
    const { id } = req.params;
    const oneEditor = await editorModel.findById(id)
    if (!oneEditor){
      return res.status(404).json({
        message: `The editor with ths ${id} doesn't exist`
      })
    }else{
      res.status(200).json({
        message: `This is the information about the Editor searched for`,
        data: oneEditor
      })
    }
  }catch(error){
    res.status(500).json({
      message: error.message
    })
  }
};

// update an editor
const UpdateEditor = async(req, res ) => {
  try{
    // get the editor by id
   const { id } = req.params;

   const updatedEditor = await editorModel.findById(id);
   if (!updatedEditor) {
    return res.status(200).json({
        message: `User with id: ${id} not found`,

    })
}
  //  get the information from the req.body
  const {UserName, FirstName, Surname, Email} = req.body

  const UserNameExists = await editorModel.findOne({ UserName })
  // check if the Username is present in the database

        if (UserNameExists) {
            return res.status(400).json({
                message: `Username already exists.`
            })
        }
        // check if email exists in the databse
        const emailExists = await editorModel.findOne({ Email })
        if (emailExists) {
            return res.status(400).json({
                message: `Email already exists.`
            })
        }

  const editorData = {
    FirstName,
    UserName,
    Surname,
    Email,
    ProfileImage: updatedEditor.ProfileImage,
    PublicId: updatedEditor.PublicId,
  };
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path);
    if (updatedEditor.PublicId) {
      await cloudinary.uploader.destroy(updatedEditor.PublicId);
    }
    bodyData.ProfileImage = result.secure_url;
    bodyData.publicId = result.public_id;
    fs.unlinkSync(req.file.path);
  }
    const newEditor = await editorModel.findByIdAndUpdate(id, editorData,{new: true} )
      res.status(200).json({
        message: `This editor with this ${id} has been succesfully updated`,
        data: newEditor
      })
  }catch(err){
    res.status(500).json({
      Error: err.message
    })
  }
}

// export the function

module.exports = {
  signup,
    userLogin,
    // verifyEmail,
    // resendVerificationEmail,
    signOut,
    forgotPassword,
    resetPassword,
    changePassword,
    getAllEditors,
    getOneEditor,
    UpdateEditor,
    

}