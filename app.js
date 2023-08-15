require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();
const port = 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema( {
    email : String,
    password : String
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) =>{
    res.render("home");
});

app.get("/register", (req, res) =>{
    res.render("register");
});

app.get("/login", (req, res) =>{
    res.render("login");
});

app.get("/secrets", (req, res) =>{
    if(req.isAuthenticated()){
        res.render("secrets");
    }else{
        res.redirect("/login");
    }
});

app.get("/logout", (req, res) =>{
    req.logout((err) => {
        if(err){
            console.log(err);
        }else{
            res.redirect("/");
        }
    });
});

app.post("/register", (req, res) =>{
    const username = req.body.username;
    const password = req.body.password;
    User.register({username : username}, password, (err, user) =>{
        if(err){
            console.log(err);
            res.redirect("/register");
        }else{
            passport.authenticate("local")(req, res, () => {
                res.redirect("/secrets");
            });
        }
    });
});

app.post("/login",(req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const user = new User({
        username : username,
        password : password
    });

    req.logIn(user, (err) => {
        if(err){
            console.log(err);
        }else{
            passport.authenticate("local")(req, res, () => {
                res.redirect("/secrets");
            });
        }
    })
});

app.listen(port, ()=>{
    console.log(`server running on port ${port}..`);
});