require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');
const socketio = require('socket.io');
const http = require('http');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('passport');

const passportInit = require('./lib/passport.init');
const spotifyRouter = require('./routes/spotify');
const { CLIENT_ORIGIN } = require('./config');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.json());
app.use(passport.initialize());
passportInit();

app.use(
  cors({
    origin: CLIENT_ORIGIN,
  }),
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  }),
);

app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('combined'));

app.set('io', io);
app.use('/', spotifyRouter);

server.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT || 3000}`);
});

module.exports = app;
