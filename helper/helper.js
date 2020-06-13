const moment = require("moment");
const momentTimezone = require("moment-timezone");


// Function to convert UTC JS Date object to a Moment.js object in WAT – West Africa Time
const dateWAT = date => {
    //return momentTimezone(date).tz(Africa/Lagos)
    return moment.tz(date, "Africa/Lagos").toDate();
};


// Function to calculate the duration of the hours between the start and end of the booking
const durationHours = (bookingStart, bookingEnd) => {
    // convert the UTC Date objects to Moment.js objeccts 
    let startDateLocal = moment(dateWAT(bookingStart));
    let endDateLocal = moment(dateWAT(bookingEnd));
  
    // calculate the duration of the difference between the two times
    let difference = moment.duration(endDateLocal.diff(startDateLocal));
    let hours = parseInt(difference.asHours());
  
    // duration in minutes
    let minutes = parseInt(difference.asMinutes());
    // return the difference in decimal format 
    return hours + minutes / 60;
};

// TOKEN DISPATCHER
const getToken = function (headers) { 
  
    if (headers && headers.authorization) {
      var parted = headers.authorization.split(' ');    
      if (parted.length === 2) {
        return parted[1];
      } else {
        return null;
      }
    } else {
      return null;
    }
  };



  module.exports = {      
      dateWAT,
      durationHours,
      getToken,
      
  }
  