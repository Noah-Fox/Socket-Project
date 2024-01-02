import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import { execFile } from 'child_process';

const app = express();
const server = createServer(app);
const io = new Server(server);

// const child = execFile('./hello', [], (error, stdout, stderr) => {
//   if (error) {
//     throw error;
//   }
//   console.log("output: " + stdout);
// });

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
    execFile('./hello', [], (error, stdout, stderr) => {
      if (error) {
        throw error;
      }
      io.emit('chat message', 'output: ' + stdout);
      console.log('output: ' + stdout);
    })
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
