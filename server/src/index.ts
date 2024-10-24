import express from 'express';
import cors from 'cors';
import cashfreeRouter from './routes/cashfreeRoutes';
import razorpayRouter from './routes/razorpayRoutes';
import stripeRouter from './routes/stripeRoutes';
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/cashfree", cashfreeRouter);
app.use("/api/v1/razorpay", razorpayRouter);
app.use("/api/v1/stripe", stripeRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
})