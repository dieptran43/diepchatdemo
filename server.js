const http = require('http');
const app = require('./app');

const port = process.env.PORT || 3000;
const server = http.createServer(app);
//declare socket.io
const io = require('socket.io')(server);

server.listen(port, _ =>{
    console.log(`Server is running at port: ${port}`);
})

var log = console.log;
var manageUsers = [];
//socket connect
io.on('connection', socket =>{
    log(`Hello, ${socket.id} - connected.`);
    //disconnect
    socket.on('disconnect', _ =>{
        log(`Bye, ${socket.id}`);
    });

    //register
    socket.on('client-send-userName', data =>{
        //log(data)
        if(manageUsers.indexOf(data) >=0){
            socket.emit('server-send-fail-register', "User name is exsist, pls create other.")
        }
        else{
            manageUsers.push(data);
            socket.userName = data;
            socket.emit('server-send-success-register', data);
            io.sockets.emit('server-send-manageUsers', manageUsers);            
            socket.broadcast.emit('server-send-message-newmember', data);            
        }
    });

    socket.on('client-send-logout', ()=>{
        log('Vao logout')
        manageUsers.splice(
            manageUsers.indexOf(socket.userName, 1)
        );
        socket.broadcast.emit('server-send-manageUsers', manageUsers);
    })

    //client typping
    socket.on("client-stypping",function(){
        socket.broadcast.emit("server-message-typping", socket.userName);
    })

    socket.on("client-stypping-out",function(){
        socket.broadcast.emit("server-message-typping-out");
    })

});
