const mongoose = require("mongoose");
const {Schema} = mongoose;

mongoose.connect("mongodb+srv://SatyaPrakash:%40Satya123@cluster0.4s3ardy.mongodb.net/User")
.then(()=>{
    console.log("Connected to MongoDb");
})
.catch((err) => {
    console.error("MongoDB connection error:", err);
});
 

const userSchema=new Schema({
    username:{
        type:String,
        required:true
    },
     firstname:{
        type:String,
        required: true
     },
     lastname:{
        type:String,
        required:true,
     },
     password:{
        type:String,
        required:true
     }
})

const accountSchema = new Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    balance:{
        type:Number,
        required:true
    }
});




const User=mongoose.model("User",userSchema);
const Account = mongoose.model("Account",accountSchema);
module.exports={
    User,
    Account
}