import axios from 'axios';
import { Request, Response, NextFunction } from 'express';

export default class AxiosController {
  static async jsonplaceholder(req: Request, res: Response, next: NextFunction): Promise<void> {
    axios
      .get('https://jsonplaceholder.typicode.com/todos')
      .then(response => res.status(200).send(response.data))
      .catch(err => next(err));
  }
}
