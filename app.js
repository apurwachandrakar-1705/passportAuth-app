const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const app = express();
const passport = require("passport"); 
const flash = require("connect-flash");
const session = require("express-session");


// passport config
require("./config/passport")(passport);
const db = require("./config/keys");
const { trusted } = require("mongoose");
// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");
// BODy parser
app.use(express.urlencoded({ extended: false }));

// Express  Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global Variable
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');

    next();
});
//Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/user"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log("connected..."));
