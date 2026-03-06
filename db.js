const mongoose = require("mongoose");
mongoose.connect("")
.then(() => {
    console.log("MongoDB connected");
})
.catch((err) => {
    console.log("MongoDB connection error:", err);
});
const Schema = mongoose.Schema;     //Schema is nothing but the structure of my data 
const ObjectId  = mongoose.ObjectId;

const user = new Schema({  //first schema which describes the user of 
    email:{type : String, unique:true},
    password:String,
    name:String
})

const todos = new Schema({
    title:String,
    done :Boolean,
    userId:ObjectId
})

const UserModel = mongoose.model('users',user);
const TodoModel = mongoose.model('todos',todos);

module.exports = {
    UserModel : UserModel,
    TodoModel : TodoModel
}
