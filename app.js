require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

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
    bcrypt.hash(password, saltRounds, function(err, hash) {
        const user = new User({
            email : username,
            password : hash
        });
        user.save().then(()=>{
            res.render("secrets");
        })
    });
    
});

app.post("/login",(req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email : username}).then((foundUser) =>{
        if(foundUser){
            bcrypt.compare(password, foundUser.password, function(err, result) {
                if(result == true){
                    res.render("secrets");
                }
            });
        }
    });
});

app.get("/logout", (req, res) =>{
    res.render("home");
});

app.listen(port, ()=>{
    console.log(`server running on port ${port}..`);
});