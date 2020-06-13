const mongoose = require("mongoose");
const moment = require("moment");
const Schema = mongoose.Schema;
const bycrypt = require("bcrypt-nodejs");

const appointmentSchema =  Schema({
    _appointmentId: Schema.Types.ObjectId,   
    appointmentStart: Date,
    appointmentEnd: Date,
    startHour: Number,
    duration: Number,   
    userId: { type: Schema.ObjectId, ref: 'User' }
  });
  // Validation to ensure an appointment cannot be double-booked
appointmentSchema.path('appointmentStart').validate(function(value) {
  
    // Extract the User Id from the query object   
    let userId = this.userId
    console.log('userId yhhyhyyhhhhhhhhh')
    console.log(this)
    // Convert appointment Date objects into a number value
    let newappointmentStart = value.getTime()
    let newappointmentEnd = this.appointmentEnd.getTime()   
   
    // Function to check for appointment clash
    let clashesWithExisting = (existingappointmentStart, existingappointmentEnd, newappointmentStart, newappointmentEnd) => {
      if (newappointmentStart >= existingappointmentStart && newappointmentStart < existingappointmentEnd || 
        existingappointmentStart >= newappointmentStart && existingappointmentStart < newappointmentEnd) {
        console.log("clash")
        throw new Error(
          `Appointment could not be saved. There is a clash with an existing appointment from ${moment(existingappointmentStart).format('HH:mm')} to ${moment(existingappointmentEnd).format('HH:mm on LL')}`
        )
      }
      console.log("no clash")
      return false
    }
    
    // Locate the user document containing the appointments   
    return User.findById(userId)
      .then(user => {
        
        //Loop through each existing appointment and return false if there is a clash
        return user.appointments.every(appointment => {
          
          // Convert existing appointment Date objects into number values
          let existingappointmentStart = new Date(appointment.appointmentStart).getTime()
          let existingappointmentEnd = new Date(appointment.appointmentEnd).getTime()          
          // Check whether there is a clash between the new appointment and the existing appointment
          return !clashesWithExisting(
            existingappointmentStart, 
            existingappointmentEnd, 
            newappointmentStart, 
            newappointmentEnd
          )
        })
      })
  }, ` Appointment {VALUE} already exist`)
  
  // user schema
const userSchema = Schema({
    email: {
        type: String,
        unique:true,
        required:true
    },   
    firstname: {
        type: String,       
        required:true
    },  
    lastname: {
        type: String,       
        required:true
    },  
    password: {
        type: String,        
        required:true
    },
    appointments: [appointmentSchema]
});



userSchema.pre("save", function(next){
    
    const user = this;
    if(this.isModified("password") ||this.isNew ){
        bycrypt.genSalt(10,function(err,salt){
            if(err){
                return next(err)
            }
            bycrypt.hash(user.password,salt,null,(err,hash)=>{
                if(err){
                    return next(err)
                }
                user.password = hash;
                next()
            })
        })
    }else{
        return next()
    }
});

userSchema.methods.comparePassword = function(pwd,next){  
    bycrypt.compare(pwd,this.password,function(err,result){        
        console.log(pwd)  
        console.log(this.password)  
        if(err){
            return next(err)
        }
        next(null,result)
    })
};

const User = (module.exports = mongoose.model("User", userSchema))