const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const cors = require("cors")
const jwt = require("jsonwebtoken")
const adminModel = require("./models/admin")
const architectModel = require("./models/architect")
const customerModel = require("./models/customer")
const feedbacksmodel = require("./models/feedback")
const planmodel = require("./models/plan")

const app = express()
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

//admin signin
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
                                res.json({ "status": "token creation failed" })
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
            { expiresIn: '1d' } // Token expires in 1 hour
        );

        res.json({ "status": "success", "token": token });
    } catch (error) {
        res.json({ "status": "error", "message": "Server error", "error": error.message });
    }
});

//customer signup
app.post("/customerSignup", async (req, res) => {
    try {
        let input = req.body;

        // Ensure the password is provided
        if (!input.password) {
            return res.status(400).json({ status: "error", message: "Password is required" });
        }

        // Hash the password before saving it
        let hashedPassword = bcrypt.hashSync(input.password, 10);
        input.password = hashedPassword;

        // Generate a unique customer ID
        const dateObject = new Date();
        const currentYear = dateObject.getFullYear();
        const currentMonth = dateObject.getMonth() + 1;
        const randomNumber = Math.floor(Math.random() * 9999) + 1000;
        const customer_id = "ARC" + currentYear.toString() + currentMonth.toString() + randomNumber.toString();

        input.customer_id = customer_id;

        // Create a new customer object
        let newCustomer = new customerModel(input);

        // Save the customer to the database
        await newCustomer.save();

        res.json({ status: "success", message: "Customer signed up successfully", customer_id: customer_id });
    } catch (error) {
        console.error("Error signing up customer:", error);
        res.status(500).json({ status: "error", message: "An error occurred during signup. Please try again later." });
    }
});

//customer login
app.post("/CustomerLogin", async (req, res) => {
    let input = req.body
    let result = customerModel.find({ email: req.body.email }).then(
        (items) => {
            if (items.length > 0) {
                const passwordValidator = bcrypt.compareSync(req.body.password, items[0].password)
                if (passwordValidator) {

                    jwt.sign({ email: req.body.email }, "E-Architect", { expiresIn: "7d" },
                        (error, token) => {
                            if (error) {
                                res.json({ "status": "error", "errorMessage": error })
                            } else {
                                res.json({ "status": "success", "token": token, "customer_id": items[0]._id })
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

//viewall customers
app.get("/ViewAllCustomers", (req, res) => {
    customerModel.find().then(
        (data) => {
            res.json(data)
        }
    ).catch((error) => {
        res.json(error)
    })
})

//viewall architects
app.get("/ViewAllArchitects", (req, res) => {
    architectModel.find().then(
        (data) => {
            res.json(data)
        }
    ).catch((error) => {
        res.json(error)
    })
})

//add Feedback
app.post("/AddFeedback", (req, res) => {
    let input = req.body
    console.log(input)
    let feedback = new feedbacksmodel(input)
    feedback.save()
    res.json({ "status": "success" })
})

//view Feedback
app.get("/viewfeedback", (req, res) => {
    feedbacksmodel.find().then(
        (data) => {
            res.json(data)
        }
    ).catch((error) => {

        res.json(error)
    })
})

//update architect profile by email
app.put("/updateArchitect", async (req, res) => {
    const { email, ...input } = req.body; // Extract email and other data to update from the request body
    const token = req.headers['token']; // Extract token from custom header

    if (!token) {
        return res.json({ "status": "failure", "message": "JWT must be provided" });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, "E-Architect");
        if (!decoded || decoded.email !== email) {
            return res.json({ "status": "failure", "message": "Invalid authentication" });
        }

        // Find the architect by email
        let architect = await architectModel.findOne({ email: email });
        if (!architect) {
            return res.json({ "status": "failure", "message": "Architect not found" });
        }

        // Update only if the password field is provided in the request body
        if (input.password) {
            input.password = await bcrypt.hash(input.password, 10);
        }

        // Update the architect with new data
        architect = await architectModel.findOneAndUpdate({ email: email }, input, { new: true });

        res.json({ "status": "success", "data": architect });
    } catch (error) {
        res.json({ "status": "failure", "message": error.message });
    }
});

//add plan request
app.post("/addPlanRequest", async (req, res) => {
    let input = req.body

    let token = req.headers.token

    jwt.verify(token, "E-Architect", async (error, decoded) => {
        if (decoded && decoded.email) {
            let result = new planmodel(input)
            await result.save()
            res.json({ "status": "success" })

        } else {
            res.json({ "status": "invalid Authentication" })
        }
    })

})
//view all plan requests
app.get("/viewPlanRequests", (req, res) => {

    let token = req.headers.token
    jwt.verify(token, "E-Architect", (error, decoded) => {
        if (decoded && decoded.email) {

            planmodel.find().then(
                (items) => {
                    res.json(items)
                }
            ).catch(
                (error) => {
                    res.json({ "status": "error" })
                }
            )
        } else {
            res.json({ "status": "invalid Authentication" })
        }
    })
})

//upload plan and make payment request



app.listen(8080, () => {
    console.log("server started")
})
