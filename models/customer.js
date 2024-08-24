const mongoose=require("mongoose")
const customerSchema=mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        address:{
            type:String,
            required:true
        },
        district:{
            type:String,
            required:true
        },
        location:{
            type:String,
            required:true
        },
        phone:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        }
    }
)

const customerModel=mongoose.model("customerdata",customerSchema)
module.exports=customerModel