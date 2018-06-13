const http = require('http');
const app = require('./app');

const port = process.env.PORT || 3000;
const server = http.createServer(app);
//declare socket.io
const io = require('socket.io')(server);

server.listen(port, _ => {
    console.log(`Server is running at port: ${port}`);
})

var log = console.log;
var manageUsers = [];
//socket connect
io.on('connection', socket => {
    //log(`Hello, ${socket.id} - connected.`);
    //disconnect
    socket.on('disconnect', _ => {
        //log(`Bye, ${socket.id}`);
    });

    //register
    socket.on('client-send-userName', data => {
        //log(data)
        debugger
        log(manageUsers);
        let checkExist = true;
        manageUsers.forEach(e => {
            if (e.data == data) {
                checkExist = false;
                return;
            }
        })
        if (checkExist == false) {
            socket.emit('server-send-fail-register', "User name is exsist, pls create other.")
        } else {
            manageUsers.push({ data: data, id: socket.id });
            socket.userName = data;

            log(manageUsers);
            socket.emit('server-send-success-register', data);
            io.sockets.emit('server-send-manageUsers', manageUsers);
            socket.broadcast.emit('server-send-message-newmember', data);

        }
    });

    socket.on('client-send-logout', () => {
        log('Vao logout')
        manageUsers.splice(
            manageUsers.indexOf(socket.userName, 1)
        );
        socket.broadcast.emit('server-send-manageUsers', manageUsers);
    })

    //client typping
    socket.on("client-stypping", function() {
        socket.broadcast.emit("server-message-typping", socket.userName);
    })

    socket.on("client-stypping-out", function() {
        socket.broadcast.emit("server-message-typping-out");
    });

    socket.on("client-create-room", data => {
        //socket.userName = data;
        let checkExist = true;
        manageUsers.forEach(e => {
            if (e.data == data) {
                checkExist = false;
                return;
            }
        })
        if (checkExist) {
            socket.roomNames = data;
            manageUsers.push({ data, id: data });
            //update for list user in client
            io.sockets.emit('server-send-manageUsers', manageUsers);
            socket.emit("server-send-inroom", data);
            socket.broadcast.emit('server-send-message-newmember', data);
            //log(socket.adapter.rooms) //know how many rooms
            //log(socket);
        }
    });

    socket.on("client-select-room", data => {
        //socket.userName = data;
        socket.join(data); //join room

        let checkExist = true;
        for (r in socket.adapter.rooms) {
            if (r == data) {
                checkExist = false;
                log(`Da tim thay ${r} - data ${data}`);
                return;
            }
        }
        if (checkExist) {
            socket.roomNames = data;
            manageUsers.push({ data, id: data });
            //update for list user in client
            io.sockets.emit('server-send-manageUsers', manageUsers);
            socket.emit("server-send-inroom", data);
            socket.broadcast.emit('server-send-message-newmember', data);
        }
    });

    //message send to users in room
    //io.sockets.in(socket.roomNames).emit("server-send-chat-inroom", data);

    //leave room
    //socket.leave(roomNames);

    socket.on("client-send-message-chat", data => {
        log(data)
            //socket.to(data.userChat).emit('server-send-chat2', data);  
        data.socketID = socket.id;
        io.sockets.in(data.userChat).emit('server-send-message-chat', data);
    });

});

function users(username, email, phone, rooms) {
    this.username = username;
    this.email = email;
    this.phone = phone;
    this.rooms = rooms;
}