import express, { NextFunction, Response, Request } from 'express';

const router = express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.render('index');
});

export default router;
