const mongoose=require("mongoose")
const architectSchema=mongoose.Schema(
    {
        architectId:{
            type:String,
            required:true
        },
        name:{
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
        profile_pic:{
            type:String,
           required:true
        },
        password:{
            type:String,
            required:true
        },
        experience:{
            type:String,
            required:true
        },
        skills:{
            type:String,
            required:true
        }
    }
)

const architectModel=mongoose.model("architectdata",architectSchema)
module.exports=architectModel