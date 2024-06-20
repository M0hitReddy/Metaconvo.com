// import socket from "../index.js";
// console.log("io", io);
import io from "../index.js";
import { dummyMessages, dummyUsers } from "./users.js";
const users = {};
// io.on('connection', (socket) => {
const setEvents = (socket) => {
    console.log('user', socket.id);
    socket.on('join', (user) => {
        users[user] = socket.id;
        console.log('a user joinedd', users);
        // const activeUsers = dummyUsers.map((useritem) => user.id === useritem.id ); 
        // io.emit('all-users', activeUsers);
    });
    socket.on('send-message', ({ sender, receiver, message }) => {
        if (users[receiver]) {
            console.log(users[receiver], "socket on send message");
            io.to(users[receiver]).emit('receive-message', { sender, receiver, message: message });
        }
    });
    socket.on('get-users', () => {
        socket.emit('all-users', dummyUsers);
    });
    socket.on('disconnect', () => {
        delete users[socket.id];
        console.log('a user disconnected', socket.id);
    });


    // console.log('a user connected', socket.id);
    // });
}

export default setEvents;