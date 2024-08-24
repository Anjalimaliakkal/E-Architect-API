const mongoose=require("mongoose")
const architectSchema=mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        phone:{
            type:String,
            required:true
        },
        emailid:{
            type:String,
            required:true
        },
        profile_pic:{
            type:String,
           required:true
        },
        password:{
            type:String,
            required:true
        }
    }
)

const architectModel=mongoose.model("architectdata",architectSchema)
module.exports=architectModel