// http://localhost:5000/

import express from 'express';
import cors, { CorsRequest } from 'cors';
// import admin from 'firebase-admin';
//used to parse the form data that you pass in the request
import { json, urlencoded } from 'body-parser';
import connectDb from './client/database';
// see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

import auth from './routes/auth';
import home from './routes/home';
import appointments from './routes/appointments';

const PORT = process.env.PORT || 3000;

const app = express();

// Middleware

//options for cors midddleware
const options: cors.CorsOptions = {
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token'],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  origin: 'API_URL',
  preflightContinue: false,
};

//use cors middleware
app.use(cors<CorsRequest>(options));

app.use(json());
app.use(
  urlencoded({
    extended: false,
  })
);

// get file from puplic folder
app.use(express.static('static'));

// Routes Middleware
app.use('/', home, auth);
app.use('/appointments', appointments);

// Connect Database
connectDb();

app.listen(PORT, () => {
  console.log('listening on port ' + PORT);
});
