const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const routes_v2 = require('./routes/v1/liveStreaming');
const logger = require('./config/logger');
const cookieparser = require('cookie-parser');

const chetModule = require("./services/liveStreaming/chat.service")

const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');

const app = express();

let http = require('http');
let server = http.Server(app);
let socketIO = require('socket.io');
let io = socketIO(server);

server.listen(config.port, () => {
  logger.info(`Listening to port ${config.port}`);
});

io.sockets.on('connection', async (socket) => {
  socket.on('groupchat', async (data) => {
    await chetModule.chat_room_create(data,io)
  });
  socket.on('', (msg) => {
    console.log('message: ' + msg);
  });
});
app.use(function (req, res, next) {
  req.io = io;
  next();
});
if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());
app.get('/', (req, res) => {
  res.sendStatus(200);
});
// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

const corsconfig = {
  credentials: true,
  origin: '*',
};
// git develper
app.use(cors());
app.options('*', cors());
app.use(cookieparser());
var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization');
  if (req.method === "OPTIONS") res.send(200);
  else next();
}
app.use(allowCrossDomain);

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}
app.use(express.static('public'));
// v1 api routes
app.use('/v1', routes);
app.use('/v2', routes_v2);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

app.get('/v1', (req, res) => {
  res.sendStatus(200);
});

app.get('/', (req, res) => {
  res.sendStatus(200);
});
app.get('/health', (req, res) => {
  res.sendStatus(200);
});
// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
