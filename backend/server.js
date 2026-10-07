import app from './app.js';
import http from 'http';
import { Server } from 'socket.io';
import { logger } from './src/config/winston-config.js';

const port = parseInt(process.env.PORT, 10) || 5000;
app.set('port', port);

// Create HTTP server
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  logger.info('🔌 New client connected');
  app.locals.socket = socket;

  socket.on('receive_data', (permission) => {
    console.log(permission);
  });

  socket.on('disconnect', () => {
    logger.info('🔌 Client disconnected');
  });
});

// Start server
server.listen(port, () => {
  logger.info('==================================================');
  logger.info(`🚀 Server is running on port: ${port}`);
  logger.info(`📚 Swagger docs: http://localhost:${port}/api-docs`);
  logger.info('==================================================');
});

server.on('error', (error) => {
  if (error.syscall !== 'listen') throw error;

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  switch (error.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

export { io };
