const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../model/user");
const bcrypt = require("bcrypt-nodejs");



/*
POST REQUEST
SIGNUP & LOGIN 
*/

router.get("/users", (req, res) => {
  User.find((err, users) => {
    if (err) {
      return next(err);
    } else {
      if (!users) {
        res.json({ success: false, message: "no user" });
      } else {
        res.json({ success: true, users });
      }
    }
  });
});



router.post("/signup", (req, res) => {
  console.log(JSON.stringify(req.body.email));
  if (!req.body.email ||  !req.body.firstname ||  !req.body.lastname || !req.body.password) {
    res.json({
      success: false,
      message: "Email, firstname, lastname, and password are required!!"
    });
  } else {
    const newUser = new User({
      email: req.body.email,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      password: req.body.password,
     
    });
    newUser.save(err => {
      if (err) {
        return res
          .status(401)
          .json({ success: false, message: "Email already exist!!" });
      }
      res.json({
        success: true,
        message: "User created!!"
      });
    });
  }
});


//LOGIN
router.post("/login", (req, res) => {
  const email = { email: req.body.email };
  const pwd = req.body.password;
  User.findOne({ email: req.body.email }, function(err, user) {
    if (err) {
      throw err;
    }
    if (!user) {
      res.status(401).send({ success: false, message: "User does not exist" });
    } else {
      // console.log(user);
      // console.log(process.env.SECRET);
      user.comparePassword(pwd, function(err, match) {
        console.log(pwd)
        console.log(match)
        if (match && !err) {
          let token = jwt.sign(user.toJSON(), process.env.SECRET,{expiresIn:'24hr'});
          res.json({success: true, token:'JWT '+token});
        } else {
          res
            .status(401)
            .send({ success: false, message: "Incorrect password!!" });
        }
      });
    }
  });
});


module.exports = router;
