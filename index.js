const express = require("express"),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  http = require("http"),
  app = express(),      
  dotenv = require('dotenv').config(),
  user = require('./routes/user'),
  appointment = require('./routes/appointment') 

  mongoose.Promise = global.Promise;

console.log(process.env.MONGODBURI);
// MIDDLEWARES
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true})); 

//Not yet connected to mongodb mlab
mongoose.connect(process.env.MONGODBURI, {useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
    console.log("connected to MongoDB");
}).catch(err =>{
    console.log("Couldn't connect to db",err)
  })

  
  // routes
  app.use("/api", user);
  app.use("/api", appointment);

  
const normalizePort = (val)=> {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
  }
const port = normalizePort(process.env.PORT);
app.set('port', port);

const server = http.createServer(app);
server.listen(port, ()=>{
    console.log(`Running on port ${port}.....`);
});
