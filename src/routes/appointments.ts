import { Request, Response, NextFunction, Router } from 'express';

import appointments = require('../db.json'); //load our local database file

const router = Router();

router.route('/').get((req: Request, res: Response, next: NextFunction) => {
  res.status(200).send(appointments);
});

router.route('/:id').get((req: Request, res: Response) => {
  let id: number = +req.params.id;
  res.status(200).send(appointments[id]);
});

export default router;
