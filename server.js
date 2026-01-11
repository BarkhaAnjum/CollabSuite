// SIMPLE WEBRTC SIGNALING SERVER (SAFE, LOCAL)
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    // Broadcast signaling data to every client *except itself*
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === 1) {
        client.send(message);
      }
    });
  });

  ws.send(JSON.stringify({ type: "welcome", message: "Connected to signaling server" }));
});

console.log("Signaling server running on ws://localhost:8080");
