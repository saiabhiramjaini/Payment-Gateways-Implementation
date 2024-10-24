import { Router } from 'express';
import { createOrder, verifyPayment } from '../controllers/razorpayControllers';


const razorpayRouter = Router();

razorpayRouter.post('/create-order', createOrder as any);
razorpayRouter.post('/verify', verifyPayment as any);

export default razorpayRouter;