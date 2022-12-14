import express from 'express';

//used to parse the form data that you pass in the request
import { json, urlencoded } from 'body-parser';
import connectDb from './client/database';
// see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

import auth from './routes/auth';
import home from './routes/home';
import appointments from './routes/appointments';
import corsInit from './middlewares/cors';
import { errorHandler } from './middlewares/handle-error';

const PORT = process.env.PORT || 3000;
process.env.NODE_ENV = 'production';

const app = express();

// Middleware

//use cors middleware
app.use(corsInit);

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
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('listening on port ' + PORT);
});
// http://localhost:5000/
