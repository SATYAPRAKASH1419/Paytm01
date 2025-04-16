const express = require("express");
const mongoose = require('mongoose')
const { Account } = require("../dataBase/db");
const router = express.Router();
const authMiddleware= require("../middleware/user");
const {JWT_SECRET}= require("../config")
const jwt = require("jsonwebtoken");

router.get("/balance", async (req, res) => {
    const authHeader = req.headers.authorization;

    // Check if Authorization header is present
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ message: "Authorization header missing or invalid format" });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userid = decoded.userid;

        const account = await Account.findOne({ userid: req.userid });

        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        res.status(200).json({
            balance: account.balance
        });
    } catch (error) {
        console.error("JWT verification or DB error:", error.message);
        return res.status(403).json({ message: "Invalid or expired token" });
    }
});


// basic approach
// router.post("/transfer",async (req,res)=>{

//       const {to,amount}=req.body;
      
//       const senderAccount = await Account.findOne({
//         userid:req.userid
//       })

//       if(senderAccount.balance < amount){
//         return res.status(400).json({
//             message: "Insufficient balance"
//         })
//       }

//       const reciverAccount = await Account.findOne({
//         userid:to
//       });

//       if(!reciverAccount){
//         return res.status(400).json({
//             message:"Invalid account"
//         })
//       }

//       await Account.updateOne({
//         userid:req.userid
//       },{
//         $inc:{
//             balance: -amount
//         }
//       })

//       await Account.updateOne({
//         userid:reciverAccount
//       },{
//         $inc:{
//             balance:amount
//         }
//       })


//     res.status(200).json({
//         message:"Transfer successful"
//     })

// })

router.post("/transfer", authMiddleware , async (req,res)=>{
          const session=await mongoose.startSession();
          session.startTransaction();
          const {amount,to}=req.body;
          
          const senderAccount=await Account.findOne({userid: req.userid}).session(session);

          if(!senderAccount ){
            await session.abortTransaction();
            return res.status(400).json({
                message:"account doesnot exist"
            })
          }

          if( senderAccount.balance <amount){
            await session.abortTransaction();
            return res.status(400).json({
                message:"insufficient balance"
            })
          }

          await Account.updateOne({userid:req.userid},{
            $inc:{
                balance:-amount
            }
          }).session(session);

          await Account.updateOne({userid:to},{
            $inc:{
                balance:amount
            }
          }).session(session);

          await session.commitTransaction();
          res.status(200).json({
            message:"Transfer successful"
          })

})
module.exports = router;