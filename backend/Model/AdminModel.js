import mongoose from "mongoose"

const adminSchema= mongoose.Schema({
    adminName: {
        type:String,
        required: true
    },
    adminEmail: {
        type:String,
        required: true
    },
    Role: {
        type: Number,
        default:4
    },
    
    adminPassword: {
        type: String,
        required:true
    }
    
},{timestamps:true})

export default mongoose.model("Admin",adminSchema)