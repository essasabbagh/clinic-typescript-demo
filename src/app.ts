import express from 'express';
import * as bodyParser from 'body-parser'; //used to parse the form data that you pass in the request
import corsInit from './middlewares/cors';
import connectDb from './client/database';
import { Home } from './routes/home';
import { Auth } from './routes/auth';
import { Appointments } from './routes/appointments';
import { errorHandler } from './middlewares/handle-error';
import { Routes } from './routes';
import helmet from 'helmet'; // Security
import compression from 'compression';
import Logger from './middlewares/logs/logger';
import morganMiddleware from './middlewares/logs/morganMiddleware';

export class App {
  protected app: express.Application;
  public homeRoutes: Home = new Home();
  public appointmentsRoutes: Appointments = new Appointments();
  public authRoutes: Auth = new Auth();

  constructor() {
    this.app = express(); //run the express instance and store in app

    const PORT = process.env.PORT || 3000;
    this.config();
    this.app.get('/logger', (_, res) => {
      Logger.error('This is an error log');
      Logger.warn('This is a warn log');
      Logger.info('This is a info log');
      Logger.http('This is a http log');
      Logger.debug('This is a debug log');

      res.send('Hello world');
    });
    this.app.use(morganMiddleware);
    new Routes(this.app);

    // Connect Database
    connectDb();
    this.app.use(errorHandler);

    this.app.listen(PORT, () => {
      // console.log('listening on port ' + PORT);
      Logger.debug(`Server is up and running @ http://localhost:${PORT}`);
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
