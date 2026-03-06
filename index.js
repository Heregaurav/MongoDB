const express = require("express")
const bcrypt = require("bcrypt")
const {UserModel , TodoModel} = require("./db"); //this is how we are connecting to the other db file 
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "iamnotgivingup"
const { z } = require("zod"); // zod is a good library to have so that we can do input validation 
const app = express();
app.use(express.json());


app.post("/signup",async function(req,res){ // there should be some input validation 
  
// this is how we are describing the schemas for the  required body 
    const requiredBody = z.object({
        email: z.string().min(3).max(100).email(),
        name: z.string().min(3).max(100),
        password:z.string().min(3).max(100)
    })
//   const parsedData = requiredBody.parse(req.body); 
// // it will have two fields 
   const parsedData = requiredBody.safeParse(req.body); //this wont throw an error and it returns us something like 
   // this is an object 
    //    {
    //     success: true | flase,
    //     data : {},
    //     errors:[]
    //    }
   //
    if(!parsedData.success){ //basically there is something wrong
            res.json({
                message:"incorrect format",
                error: parsedData.error // this will also return the error made by the user 
            })
            return 
    }
  
    const email = req.body.email;  // string @ , 5  
    const password = req.body.password; // string  , 10 chars , 1 special characters , 1 uppercase , 1 lowercase 
    const name = req.body.name; // string 

if(typeof email !== "string"|| email.length < 5 || !email.includes("@")){
    res.json({
        message:"Email incorrect"
    })
    return 
}


// this part of code has the potential to make the whole server go down and stop working in  case of error
// therefore we have to handle the error in the best way possible 
 
let errorThrown = false;
try {

    // we remember we promisify the fs.readfile  // bcrypt.hash is similar to fs.read  .. here we have promisified this too 
    const hashedpassword =  await bcrypt.hash(password,5);
    console.log(hashedpassword);

  await UserModel.create({
        email: email,
        password: hashedpassword,
        name: name
    })

    }catch(e){
        res.json({
            message: " user already exists"
        })
        errorThrown = true;
    }

    if(!errorThrown){
        res.json({
            message:"you are signed up"
        })
    }
    });


app.post("/signin", async function(req,res){
    const email = req.body.email;
    const password = req.body.password;

    const response =  await UserModel.findOne({
        email:email,
    })

    if(!response){
        res.status(403).json({
            message: " user does not exit in our database"
        })
    }

   const passwordmatch = await bcrypt.compare(password, response.password)

    console.log(passwordmatch)
    if(passwordmatch){
        const token =jwt.sign({
            id:response._id.toString() // we have to convert that to string 

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