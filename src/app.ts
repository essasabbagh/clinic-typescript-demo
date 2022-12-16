import express from 'express';
import * as bodyParser from 'body-parser'; //used to parse the form data that you pass in the request
import corsInit from './middlewares/cors';
import { Home } from './routes/home';
import { Auth } from './routes/auth';
import { Appointments } from './routes/appointments';

class App {
  public app: express.Application;
  public homeRoutes: Home = new Home();
  public appointmentsRoutes: Appointments = new Appointments();
  public authRoutes: Auth = new Auth();

  constructor() {
    this.app = express(); //run the express instance and store in app
    this.config();
    this.homeRoutes.routes(this.app);
    this.appointmentsRoutes.routes(this.app);
    this.authRoutes.routes(this.app);
  }

  private config(): void {
    // support application/json type post data
    this.app.use(bodyParser.json());
    //support application/x-www-form-urlencoded post data
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(corsInit);

    // get file from puplic folder
    this.app.use(express.static('static'));
  }
}

export default new App().app;
