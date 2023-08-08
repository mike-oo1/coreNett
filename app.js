const express =require("express")
const route =require("./Router/route")
const PORT = process.env.PORT
const app =express()
app.use(express.json())
app.use("/api",route)


app.listen(PORT,()=>{
    console.log("connected")
})

module.exports =app