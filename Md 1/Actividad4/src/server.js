import http from 'http';
import app from './app.js';
import { Server } from 'socket.io';

const server = http.createServer(app);
export const socketServer = new Server(server, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"]
    }
});
const PORT = 8080;

server.listen(PORT, () => {
    console.log(`Server running in http://localhost:${PORT}/`);
});
