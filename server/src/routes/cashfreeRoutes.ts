import { Router } from 'express';
import { payment, verifyPayment } from '../controllers/cashfreeControllers';

const cashfreeRouter = Router();

cashfreeRouter.get('/', payment as any);
cashfreeRouter.post('/', verifyPayment as any);

export default cashfreeRouter;