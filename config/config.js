require( 'dotenv' ).config();

const mongoose= require("mongoose")
// const mongoose = require( 'mongoose' );

const username = process.env.ATLAS_USERNAME
const password = process.env.ATLAS_PASSWORD
const url2 = `mongodb+srv://michaelokpoko224:ObsuNbIXB7NqOI7n@cluster0.xbfa3v6.mongodb.net/`

mongoose.connect( url2 ).then( () => {
    console.log('Database is successfully connected.')
} ).catch( (e) => {
    console.log(e.message)
});

// mongoDB username and password
const ATLAS_USERNAME = "amakaekeh15"
const ATLAS_PASSWORD = "AYZvtV0AwIsbrYmH"

//cloudinary
const CLOUD_NAME = "dm3h1v4zx"
const API_KEY = "339537389284312 "
const API_SECRET = "LQMuVUVjm0dGY8n4xC0C0DMIkI4"


Secret = "Makis"

secretKey = "Makis"

// mailtrap username nd password
const MAIL_TRAP_USERNAME = "cbf3a229a68e8f"
const MAIL_TRAP_PASSWORD = "a012f8ba989c2d"
 const BASE_URL = "localhost:6450/api/"

//gmail username and password
const service = "gmail"
 const passwords = "kyekvroknaoklfnr"
const  user = "corenetplus@gmail.com" 


PORT = 5679





