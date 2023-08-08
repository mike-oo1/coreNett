// calling the needed modules

require ("dotenv").config();
const writerModel = require("../models/writerModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const cloudinary = require('../utils/cloudinary');
const validator = require('../middleware/writerValidation')

// create a mailing function

const transporter = nodemailer.createTransport({
    service: process.env.service,
    auth: {
      user: process.env.user,
      pass: process.env.password
    }
  });

  // create a writer
const createWriter = async ( req, res ) => {
    try {
        // get all data from the request body
        const { FullName, UserName, Email, Password } = req.body;

        
    const validation = validator(Email, FullName);
    if (!validation.isValid) {
      return res.status(400).json({
        message: validation.message
      });
    }

        // check if username exists
        const UsernameExists = await writerModel.findOne({ UserName })
        if(UsernameExists){
            res.status( 400 ).json( {
                message: `user with this username: ${UserName} already exist.`
            })
        }
        // check if the entry email exist
        const isEmail = await writerModel.findOne( { Email } );
        if ( isEmail ) {
            res.status( 400 ).json( {
                message: `user with this email: ${Email} already exist.`
            })
        } else {
            // salt the password using bcrypt
            const saltedRound = await bcrypt.genSalt( 10 );
            // hash the salted password using bcryptE
            const hashedPassword = await bcrypt.hash( Password, saltedRound );

            // create a writer
            const user = new writerModel( {
                FullName: FullName.toUpperCase(),
                UserName,
                Email: Email.toLowerCase(),
                Password: hashedPassword,
                
            } );

            // create a token
            const token = jwt.sign({
                id: user._id,
                Password: user.Password,
                Email: user.Email
            },
    
                process.env.secretKey, { expiresIn: "5 days" },
            );
            
            // send verification email
            const baseUrl = process.env.BASE_URL
            const mailOptions = {
                from: process.env.user,
                to: Email,
                subject: "Verify your account",
              html: `Please click on the link to verify your email: <a href="${req.protocol}://${req.get("host")}/api/users/verify-email/${token}">Verify Email</a>`,
            };

            await transporter.sendMail( mailOptions );

            // save the user
            
             user.token = token
             const savedUser = await user.save();

          
            // return a response
            res.status( 201 ).json( {
            message: `Check your email: ${savedUser.Email} to verify your account.`,
            data: savedUser,
          
        })
        }
    } catch (error) {
        res.status( 500 ).json( {
            message: error.message
        })
    }
};

 
// verify email
const verifyWriterEmail = async (req, res) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(404).json({
              message: "not found token.",
            });
          }
        // verify the token
        const { Email } = jwt.verify( token, process.env.secretKey );

        const writer = await writerModel.findOne( { Email: Email.toLowerCase()  } );

        // Check if editor exists
      if (!writer) {
        return res.status(404).json({
          message: "Writer not found. Invalid or expired token.",
        });
      }
        // update the user verification
        writer.isVerified = true;

        // save the changes
        await writer.save();

        // update the user's verification status
        const updatedWriter = await writerModel.findOneAndUpdate( {Email: Email.toLowerCase()}, writer );

        res.status( 200 ).json( {
            message: "writer verified successfully",
            data: updatedWriter,
        })

    } catch ( error ) {
        res.status( 500 ).json( {
            message: error.message
        })
    }
}

// resend verification
const resendVerificationWriterEmail = async (req, res) => {
    try {
        // get user email from request body
        const { Email } = req.body;

        // find editor
        const writer = await writerModel.findOne( { Email: Email.toLowerCase() } );
        if ( !writer ) {
            return res.status( 404 ).json( {
                error: "Writer not found"
            } );
        }

        // create a token
            const token = await jwt.sign( { Email: Email.toLowerCase() }, process.env.secretKey, { expiresIn: "50m" } );
            
             // send verification email
             const baseUrl = process.env.BASE_URL
            const mailOptions = {
                from: process.env.user,
                to: Email,
                subject: "Verify your account",
                html: `Please click on the link to verify your email: <a href="${req.protocol}://${req.get("host")}/api/users/verify-email/${token}">Verify Email</a>`,
            };


            await transporter.sendMail( mailOptions );

        res.status( 200 ).json( {
            message: `Verification email sent successfully to your email: ${writer.Email}`
        } );

    } catch ( error ) {
        res.status( 500 ).json( {
            message: error.message
        })
    }
};

// login function
const userLogin = async (req, res) => {
    try {
      // Extract the username, email, and password from the request body
      const { UserName, Password } = req.body;
  
      // Find the writer by their email or username
      const writer = await writerModel.findOne({ UserName } );
  
      // Check if the writer exists
      if (!writer) {
        return res.status(404).json({
          message: `Username/Email is not found`,
        });
      }
  
      // Compare the inputted password with the existing one using bcrypt.compare
      const checkPassword = bcrypt.compareSync(Password, writer.Password);
  
      // Check for password match
      if (!checkPassword) {
        return res.status(400).json({
          message: `Login Unsuccessful`,
          failed: `Invalid PASSWORD`,
        });
      }

      //   check if user is verified
    // if(!writer.isVerified){
    //     return res.status(404).json({
    //         message: `User with ${writer.Email} is not verified`,
            
    //     })
    // }
  
      // Generate a JWT token with the writer's ID and other information
      const token = jwt.sign(
        {
          id: writer._id,
          UserName: writer.UserName,
          Email: writer.Email
        },
        process.env.secretKey,
        { expiresIn: "1d" }
      );
  
      // Save the token to the editor's document
      writer.token = token;
      await writer.save();
  
      // Return success response with token and editor's data
      res.status(200).json({
        message: `User logged in successfully`,
        data: {
          id: writer._id,
          UserName: writer.UserName,
          token: writer.token,
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
        const writerId = req.params.id;
        // update the writer's token to null
        const writer = await writerModel.findByIdAndUpdate(writerId, {token: null}, {new: true})
        if (!writer){
            return res.status(404).json({
                message: `Writer not found`
            })
        }
        res.status(200).json({
            message: `Writer logged out successfully`
        })
    }catch(e){
        res.status(500).json({
            error: e.message
        })
    }

}
// Forgot Password
const forgotPassword = async (req, res) => {
    try {
      const { Email } = req.body;
  
      // Check if the email exists in the userModel
      const writer = await writerModel.findOne({ Email: Email.toLowerCase() });
      if (!writer) {
        return res.status(404).json({
          message: "Writer not found"
        });
      }
  
      // Generate a reset token
      const resetToken = await jwt.sign({ writerId: writer._id }, process.env.secretKey, { expiresIn: "30m" });
  
      // Send reset password email
      const mailOptions = {
        from:  process.env.user,
        to: writer.Email,
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
  
      // Verify the writer's token
      const decodedToken = jwt.verify(token, process.env.secretKey);
  
      // Get the writer's ID from the token
      const writerId = decodedToken.id;
  
      // Find the writer by ID
      const writer = await writerModel.findById(writerId);
      if (!writer) {
        return res.status(404).json({
          message: "Writer not found"
        });
      }
  
      // Salt and hash the new password
      const saltedRound = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, saltedRound);
  
      // Update the editor's password
      writer.Password = hashedPassword;
      await writer.save();
  
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
  
      // Verify the writer's token
      const decodedToken = jwt.verify(token, process.env.secretKey);
  
      // Get the writer's Id from the token
      const writerId = decodedToken.id;
  
      // Find the writer by ID
      const writer = await writerModel.findById(writerId);
      if (!writer) {
        return res.status(404).json({
          message: "Writer not found"
        });
      }
  
      // Confirm the previous password
      const isPasswordMatch = await bcrypt.compare(existingPassword, writer.Password);
      if (!isPasswordMatch) {
        return res.status(401).json({
          message: "Existing password is incorrect."
        });
      }
  
      // Salt and hash the new password
      const saltedRound = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, saltedRound);
  
      // Update the user's password
      writer.Password = hashedPassword;
      await writer.save();
  
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
  




module.exports = {
    createWriter,
    verifyWriterEmail,
    resendVerificationWriterEmail,
    signOut,
    userLogin,
    forgotPassword,
    changePassword,
    resetPassword

}