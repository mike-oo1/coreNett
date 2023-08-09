const express = require("express")
const config =require("./config/config.js");
const editorRoute = require("./routes/editorRoutes")
const writerRoute = require('./routes/writerRoutes')
const route=require("./routes/commentRouter")
const routes =require("./routes/taskRouter")
const fileupload =require("express-fileupload")
const cors = require("cors")
const path=require("path")



const PORT = 5697;

const app = express();
app.use(cors({origin:"*"}))
app.use(express.json());
app.use("/uploads", express.static(__dirname + "/uploads"))

app.use(
    fileupload({
        useTempFile:true
    })
)

app.use("/api", editorRoute)
app.use("/api", writerRoute)
app.use("/api",route)
app.use("/api",routes)

app.listen(PORT, () => {
    console.log(`Server is listening to ${PORT}`)
})
