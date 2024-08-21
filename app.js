const express=require("express")
const mongoose=require("mongoose")
const bcrypt=require("bcrypt")
const cors=require("cors")
const jwt=require("jsonwebtoken")
const loginModel=require("./models/admin")

const app=express()
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://anjali2003:anjali2003@cluster0.wy6js.mongodb.net/Architect_db?retryWrites=true&w=majority&appName=Cluster0")

//admin signup
app.post("/adminSignup", (req, res) => {
    let input = req.body
    let hashedpassword = bcrypt.hashSync(input.password, 10)
    //console.log(hashedpassword)
    input.password = hashedpassword
    console.log(input)
    let result = new loginModel(input)
    result.save()
    res.json({ "status": "success" })

})



app.listen(8080, ()=>{
    console.log("server started")
})
