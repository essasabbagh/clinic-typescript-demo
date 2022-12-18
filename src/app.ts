import express from 'express';
import * as bodyParser from 'body-parser'; //used to parse the form data that you pass in the request
import corsInit from './middlewares/cors';
import connectDb from './client/database';
import { Home } from './routes/home';
import { Auth } from './routes/auth';
import { Appointments } from './routes/appointments';
import { errorHandler } from './middlewares/handle-error';
import { Routes } from './routes';
import helmet from "helmet"; // Security
import compression from "compression";

export class App {
  protected app: express.Application;
  public homeRoutes: Home = new Home();
  public appointmentsRoutes: Appointments = new Appointments();
  public authRoutes: Auth = new Auth();

  constructor() {
    this.app = express(); //run the express instance and store in app

    const PORT = process.env.PORT || 3000;
    this.config();
    new Routes(this.app);

    // Connect Database
    connectDb();

    this.app.use(errorHandler);

    this.app.listen(PORT, () => {
      console.log('listening on port ' + PORT);
    });
  }

  private config(): void {
    // support application/json type post data
    this.app.use(bodyParser.json());
    //support application/x-www-form-urlencoded post data
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(corsInit);
    // adding set of security middlewares
    this.app.use(helmet());
    // compresses all the responses
    this.app.use(compression());

    // get file from puplic folder
    this.app.use(express.static('static'));
  }
}

// http://localhost:5000/
