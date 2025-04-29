import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

let userCount = 0;
let allSockets: WebSocket[] = []

wss.on("connection", function(socket) {
  allSockets.push(socket);

  const connectionId = Math.floor(Math.random() * 1000)
  userCount += 1;
  console.log("User connected: " + connectionId + ", User count: " + userCount);

  socket.on("message", (message) => {
    // // Broadcast message
    // wss.clients.forEach((client) => {
    //   socket.send(`User ${connectionId} sent message ${message}`);
    // })

    for (let i = 0; i < allSockets.length; i++) {
      const s = allSockets[i]
      s.send(`User ${connectionId} sent message ${message}`);
    }

  })
  
})