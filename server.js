const express = require("express")
const config =require("./config/config.js");
const editorRoute = require("./routes/editorRoutes")
const writerRoute = require('./routes/writerRoutes')
const route=require("./routes/commentRouter")
const routes =require("./routes/taskRouter")
const cors = require("cors")



const PORT = 5697;

const app = express();
app.use(cors({origin:"*"}))
app.use(express.json());
app.use("/uploads", express.static("uploads"))

app.use("/api", editorRoute)
app.use("/api", writerRoute)
app.use("/api",route)
app.use("/api",routes)

app.listen(PORT, () => {
    console.log(`Server is listening to ${PORT}`)
})
