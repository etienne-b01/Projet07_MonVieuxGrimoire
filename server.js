const http = require('http');
const app = require('./app');

const normalizePort = (val) => {
  const port = parseInt(val, 10); // Converts the port value to an integer

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false; // For negative values or invalid ports, return false.
};

//uses port from environment variable or default to 4000.
const port = normalizePort(process.env.PORT || '4000');
app.set('port', port);

const errorHandler = (error) => {
  if (error.syscall !== 'listen') {
    throw error; // If the error is not related to the server 'listen' syscall, rethrow the error.
  }

  const address = server.address();
  const bind =
    typeof address === 'string' ? 'pipe ' + address : 'port: ' + port; // Defines how the server is being bound (port or pipe).

  // Covers cases where the port requires elevated privileges or is already in use by another process: will exit the process with an error code (1)
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error; // For any other errors, rethrow the error.
  }
};

// Creates an HTTP server using the Express app as a request handler.
const server = http.createServer(app);

// Event listener for handling errors during server operation.
server.on('error', errorHandler);

// Event listener for logging when the server starts successfully.
server.on('listening', () => {
  const address = server.address(); // Gets the server address.
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port; // Logs how the server is bound (pipe or port).
  console.log('Listening on ' + bind);
});

// Starts the server and listens on the defined port.
server.listen(port);
