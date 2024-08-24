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
 app.post("/addArchitect", async (req, res) => {
     const input = req.body;
     const token = req.headers.token;

     try {
         const decoded = jwt.verify(token, "E-Architect");
         if (decoded && decoded.email) {
             // Hash the password before saving
             input.password = await bcrypt.hash(input.password, 10);

             // Create a new architect instance
             const newArchitect = new architectModel(input);

             // Save the architect instance
             await newArchitect.save();

             res.json({ "status": "success" });
         } else {
             res.json({ "status": "invalid authentication" });
         }
     } catch (error) {
         res.json({ "status": "error", "message": error.message });
     }
});


//architect login
app.post("/architectLogin", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the architect by email
        const architect = await architectModel.findOne({ email: email });

        if (!architect) {
            return res.json({ "status": "error", "message": "Invalid email or password" });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, architect.password);

        if (!isMatch) {
            return res.json({ "status": "error", "message": "Invalid email or password" });
        }

        // Password is correct, create and return a JWT token
        const token = jwt.sign(
            { email: architect.email, id: architect._id },
            "E-Architect",
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        res.json({ "status": "success", "token": token });
    } catch (error) {
        res.json({ "status": "error", "message": "Server error", "error": error.message });
    }
});



app.listen(8080, ()=>{
    console.log("server started")
})
