const express = require("express");
const router = express.Router();
const User = require("../model/user");
const helper = require('../helper/helper');
const jwt = require("jsonwebtoken");
const moment = require("moment");
const momentTimezone = require("moment-timezone"),

path   = require('path')
 


// make appointment
router.put("/appointment", (req, res) => {
  
    const token = helper.getToken(req.headers);    
    jwt.verify(token,process.env.SECRET,(err,user)=>{  
        if(err){
            res.status(403).json({ success: false, message: "Please login or signup" });
        }else{
           
            User.findByIdAndUpdate(
              user._id,
              {
                $addToSet: {
                    appointments: {
                    userId: user._id,
                    // The hour on which the appointment starts, calculated from 12:00AM as time = 0
                    startHour: helper.dateWAT(req.body.appointmentStart),
                    // The duration of the appointment in decimal format
                    duration: helper.durationHours(
                      req.body.appointmentStart,
                      req.body.appointmentEnd
                    ),               
                    // Spread operator for remaining attributes
                    ...req.body
                  }
                }
              },
              { new: true, runValidators: true, context: "query" }
            )
              .then(appointment => {
               
                res.status(201).json(appointment);
              })
              .catch(error => {
                res.status(400).json({ error });
              });
                   
        }   
    })
  }
);

router.delete("/appointment/:id", (req, res) => {
  const id = req.params.id;
  const token = helper.getToken(req.headers);   
  jwt.verify(token,process.env.SECRET,(err,user)=>{
    if(err){
        console.log(err)
        res.status(403).json({ success: false, message: "Unathorized access" });
    }else{
        User.findByIdAndUpdate(
          user._id,
          { $pull: { appointments: { _id: id } } },
          { new: true }
        )
          .then(appointment => {
            console.log("deleted");
            console.log(appointment)
            res.status(201).json(appointment);
          })
          .catch(error => {
            res.status(400).json({ error });
          });

    }

   })  
 
});





module.exports = router;
