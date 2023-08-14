require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();
const port = 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema( {
    email : String,
    password : String
});


const User = mongoose.model("User", userSchema);

app.get("/", (req, res) =>{
    res.render("home");
});

app.get("/register", (req, res) =>{
    res.render("register");
});

app.get("/login", (req, res) =>{
    res.render("login");
});

app.post("/register", (req, res) =>{
    const username = req.body.username;
    const password = req.body.password;
    const user = new User({
        email : username,
        password : md5(password)
    });
    user.save().then(()=>{
        res.render("secrets");
    })
});

app.post("/login",(req, res) => {
    const username = req.body.username;
    const password = md5(req.body.password);
    User.findOne({email : username}).then((foundUser) =>{
        if(foundUser){
            if(foundUser.password === password){
                res.render("secrets");
                }
        }
    });
});

app.listen(port, ()=>{
    console.log(`server running on port ${port}..`);
});