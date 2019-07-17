const express = require("express");
const app = express();
const bodyParser = require("body-parser");
var socket = require('socket.io');
var server = app.listen(4000, function(){
   console.log('listening for requests on port 4000');
});
app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html");
});
var clients = []; 
var io = socket(server);
io.on('connection', (socket) => {
    console.log('made socket connection', socket.id);
    socket.on("setalarm",(data)=>{
        data.socket_id = socket.id;
       addToQueue(data);  
    });
    socket.on('disconnect', function(){
        console.log("Disconnected Socket " + socket.id);
         for(i=0;i<clients.length;i++)
            {
                if(clients[i].socket_id==socket.id){
                    clients.splice(i,2);
                }
            }
            // for(i=0;i<clients.length;i++)
            // console.log(clients[i].time);
    });
    setInterval(intervalFunc, 1000);
 
});
function intervalFunc() {
    var date = new Date();
    var time = addZero(date.getHours()) + ":" + addZero(date. getMinutes() );
    
    if(clients.length!=0)
    {  //console.log(time);
        if(clients[clients.length-1].time<=time)
        {
            console.log("alarm strikes "+time);
            io.to(clients[clients.length-1].socket_id).emit('strike', 'done');
            clients.pop();
            // for(i=0;i<clients.length;i++)
            // console.log(clients[i].time);
        }
    }
}
function addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }
  function addToQueue(data){
    var date = new Date();
    var time = addZero(date.getHours()) + ":" + addZero(date. getMinutes() );
    
      if(clients.length==0){
          //console.log("hey");
        clients.push(data);
      }
      else if(clients.length==1){
        //console.log("hey");
        if(clients[0].time<data.time){
            //console.log("hey");
            clients[1]=clients[0];
            clients[0] = data;
           // console.log(clients[0].time+"-------"+clients[1].time);
        }
        else{
            clients[1] = data;
           // console.log(clients[0].time+"-------"+clients[1].time);
        }
      }
      else if(clients.length>1){
          var i = 0;
          for(i = 0;i<clients.length  && data.time <=clients[i].time;i++);
          console.log(clients.join());
          //console.log(i);
          clients.splice(i, 0, data);
          console.log(clients.join());
         // console.log(clients[0].time+"-------"+clients[1].time+"-------"+clients[2].time);
      }
  }
