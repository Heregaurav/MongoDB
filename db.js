const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://yourgaurav:QubhE4v0ptM7o3RZ@cluster0.gj5bui7.mongodb.net/Todos-app-database")
.then(() => {
    console.log("MongoDB connected");
})
.catch((err) => {
    console.log("MongoDB connection error:", err);
});
const Schema = mongoose.Schema;
const ObjectId  = mongoose.ObjectId;
const user = new Schema({
    email:String,
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