import { Request, Response, Router } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

router.get('/home', (req: Request, res: Response) => {
  res.send('Hello Home router Api');
});

export default router;
