const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require('passport');
//User model
const User = require("../models/User");
const { route } = require(".");

//login page
router.get("/login", (req, res) => {
  res.render("login");
});
// register page
router.get("/register", (req, res) => {
  res.render("register");
});
// REsgister handle

router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];
  // Check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "please fill all fields" });
  }
  // Check passwords
  if (password !== password2) {
    errors.push({ msg: "no match..." });
  }
  // Check pass length
  if (password.length < 6) {
    errors.push({ msg: "Too Short" });
  }
  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    // VAlidation Passed
    User.findOne({ email: email }).then((user) => {
      if (user) {
        // User exists
        errors.push({ msg: "Email is already registered" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });

        // Hash Password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) {
              console.log(err);
            }
            // set password to hashed
            newUser.password = hash;
            // Save user
            newUser
              .save()
              .then((user) => {
                req.flash('success_msg','You are now Family..');
                res.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

//LOcal handle
router.post('/login',(req,res,next)=>{
passport.authenticate('local',{
  successRedirect: '/dashboard',
  failureRedirect:  '/users/login',
  failureFlash: true
})(req,res,next);
});

// Logout handle
// Logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
    }
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });
});




module.exports = router;
