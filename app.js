const express=require("express")
const mongoose=require("mongoose")
const bcrypt=require("bcrypt")
const cors=require("cors")
const jwt=require("jsonwebtoken")
const adminModel=require("./models/admin")
const architectModel=require("./models/architect")

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
    let result = new adminModel(input)
    result.save()
    res.json({ "status": "success" })

})

//admin signup
app.post("/adminSignin", (req, res) => {
    let input = req.body
    let result = adminModel.find({ username: input.username }).then(
        (response) => {
            if (response.length > 0) {
                const validator = bcrypt.compareSync(input.password, response[0].password)
                if (validator) {
                    jwt.sign({ email: input.username }, "E-Architect", { expiresIn: "7d" },
                        (error, token) => {
                            if (error) {
                                res.json({"status":"token creation failed"})
                            } else {
                                res.json({ "status": "success", "token": token })
                            }
                        })
                } else {
                    res.json({ "status": "wrong password" })
                }
            } else {
                res.json({ "status": "username doesn't exist" })
            }
        }
    ).catch()
})

//add architect by admin
app.post("/addArchitect", (req, res) => {
    let input = req.body
    let token=req.headers.token
    jwt.verify(token,"E-Architect",(error,decoded)=>{
        if (decoded && decoded.email) {
            let result=new architectModel(input)
            result.save()
            res.json({ "status": "success" })
        } else {
            res.json({ "status": "invalid authentication" })
        }
    })
})

//architect login
app.post("/ArchitectLogin",async(req,res)=>{
    let input=req.body
    let result = architectModel.find({ emailid: req.body.emailid }).then(
        (items) => {
            if (items.length > 0) {
                const passwordValidator = bcrypt.compareSync(req.body.password, items[0].password)
                if (passwordValidator) {

                    jwt.sign({ emailid: req.body.emailid }, "E-Architect", { expiresIn: "7d" },
                        (error, token) => {
                            if (error) {
                                res.json({ "status": "error", "errorMessage": error })
                            } else {
                                res.json({ "status": "success", "token": token, "architect_id": items[0]._id })
                            }
                        })
                } else {
                    res.json({ "status": "incorrect password" })
                }
            } else {
                res.json({ "status": "invalid email id" })
            }
        }
    ).catch()
})

app.listen(8080, ()=>{
    console.log("server started")
})
