const express = require("express")
const {UserModel , TodoModel} = require("./db");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "iamnotgivingup"
const app = express();
app.use(express.json());

app.post("/signup",async function(req,res){
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
  await UserModel.create({
        email: email,
        password: password,
        name: name
    })
    res.json({
        message:"you are logged in"
    })
});


app.post("/signin", async function(req,res){
    const email = req.body.email;
    const password = req.body.password;

    const user =  await UserModel.findOne({
        email:email,
        password:password
    })

    console.log(user)
    if(user){
        const token =jwt.sign({
            id:user._id.toString() // we have to convert that to string 

        },JWT_SECRET);
        res.json({
            token: token
        })
    }else{
        res.status(403).json({
            message:"Incorrect credentials"
        })
    }
});

app.post("/todo",auth ,async function(req,res){
    const userId = req.userId;
    const todo = req.body.todo;

    await UserModel.create({
        todo: todo
    })
    res.json({
        message: " your todo is being saved "
    })

});

app.get("/todos",auth , async function(req,res){
    const userId = req.userId;
    const todos = await TodoModel.find({
        userId: userId
    })
    res.json({
        todos: todos
    })

});

function auth(req,res,next){
    const token = req.headers.token;
    const decodeData = jwt.verify(token, JWT_SECRET);
    if(decodeData){
        req.userId = decodeData.id;
        next();

    }else{
        res.status(403).json({
            message:"Incorrect credential"
        })
    }

}
app.listen(3000);