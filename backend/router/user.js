const express = require('express');
const { Schema ,z } = require('zod');
const router = express.Router();
const {User, Account}=require('../dataBase/db');
const { JWT_SECRET } = require('../config');
const jwt = require("jsonwebtoken");

const signupSchema =z.object({
    firstname:z.string(),
    lastname:z.string(),
    password:z.string(),
    username:z.string().email()
})

router.post("/signup",async (req,res)=>{
    
    const response=signupSchema.safeParse(req.body);
    if(!response.success){
        res.status(411).json({
            message: "Incorrect Inputs"
        })
    }else{
        //check user already exists
        const existingUser=await User.findOne({
            username:req.body.username
        })

        if(existingUser){
            return res.status(411).json({
               message:"The user is already exists" 
            })
        }else{
            const user=await User.create({
                username:req.body.username,
                password:req.body.password,
                firstname:req.body.firstname,
                lastname:req.body.lastname
            })

            const userid=user._id;
            
            await Account.create({
                userid,
                balance: 1+ Math.random()*100000
            })
            const token=jwt.sign({
                userid
            },JWT_SECRET);

            res.json({
                message: "User created successfully",
                token:token
            })
        }

    }
})

const signinSchema = z.object({
    username:z.string().email(),
    password:z.string()
})


router.post("/signin", async (req,res)=>{
   const response= signinSchema.safeParse(req.body);
   if(!response.success){
    return res.status(411).json({
        messgae:"Incorrect inputs"
    })
   }

   const user = await User.findOne({
    username:req.body.username,
    password:req.body.password
   });

   if(user){
    const token= jwt.sign({
        userid:user._id
    },JWT_SECRET);

    res.status(200).json({
        token:token
    })

    return;
   }

   res.status(411).json({
    message:"Error while logging in"
   })
})

const updateSchema = z.object({
    password:z.string().optional(),
    firstname:z.string().optional(),
    lastname:z.string().optional()
})

router.put("/",async (req,res)=>{
  const {success} = updateSchema.safeParse(req.body);
  if(!success){
    res.status(411).json({
        message:"Error while updating information"
    })
  }

  await  User.updateOne({_id:req.userid}, req.body);

  res.status(200).json({
    message:"Updated successfully"
  })

})

router.get("/bulk",async (req,res)=>{
    const filter = req.query.filter || "";

    const users = await User.find({
        $or:[
            {
                firstname:{
                    "$regex":filter
                }
            },{
                lastname:{
                    "$regex":filter
                }
            }
        ]
    })

    res.json({
        user: users.map(user => ({
            username:user.username,
            firstname:user.firstname,
            lastname:user.lastname,
            _id:user._id
        }))
    })
})

module.exports=router;