import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  socket: WebSocket;
  roomId: string;
}

let userCount = 0;
let allSockets: User[] = []

wss.on("connection", function(socket) {
  // allSockets.push(socket);

  const connectionId = Math.floor(Math.random() * 1000)
  userCount += 1;
  console.log("User connected: " + connectionId + ", User count: " + userCount);

  socket.on("message", (message) => {
    // // Broadcast message
    // wss.clients.forEach((client) => {
    //   client.send(`User ${connectionId} sent message ${message}`);
    // })

    // for (let i = 0; i < allSockets.length; i++) {
    //   const s = allSockets[i]
    //   s.send(`User ${connectionId} sent message ${message}`);
    // }


    const parsedMessage = JSON.parse(message.toString())

    if (parsedMessage.type === "join") {
      allSockets.push({
        socket,
        roomId: parsedMessage.payload.roomId
      })
    }

    if (parsedMessage.type === "chat") {
      const currentUserRoom = allSockets.find((x) => x.socket === socket)?.roomId
      allSockets.forEach((user) => {
        if (user.roomId === currentUserRoom) {
          user.socket.send(parsedMessage.payload.message)
        }
      })
    }
  })


  // socket.on('close', () => {
  //   allSockets = allSockets.filter(s => s !== socket);
  // })
  
})