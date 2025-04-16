const express = require("express");
const rootRouter=require("./router/index");
const cors = require('cors');


const app=express();
app.use(cors());
const PORT=3000;

app.use(express.json());
// app.get("/",(req,res)=>{
//     res.send("Hii");
// })
app.use("/api/v1", rootRouter);

app.listen(PORT,(err)=>{
    if(err) console.log(err);
    console.log("Server is listening on PORT: ", PORT);
});

