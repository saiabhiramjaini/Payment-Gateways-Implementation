import { Request, Response } from "express";
import crypto from "crypto";
import { Cashfree } from "cashfree-pg";


// Initialize Cashfree configuration
const initializeCashfree = () => {
  const clientId = process.env.CASHFREE_CLIENT_ID;
  const clientSecret = process.env.CASHFREE_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    throw new Error("Cashfree credentials not found in environment variables");
  }

  Cashfree.XClientId = clientId;
  Cashfree.XClientSecret = clientSecret;
  Cashfree.XEnvironment = Cashfree.Environment.SANDBOX; // Change to PRODUCTION for live
};

const generateOrderId = (): string => {
  const uniqueId = crypto.randomBytes(16).toString("hex");
  const hash = crypto.createHash("sha256");
  hash.update(uniqueId);
  const orderId = hash.digest("hex");
  return orderId.substr(0, 12);
};

export const payment = async (req: Request, res: Response) => {
  try {
    // Initialize Cashfree with credentials
    initializeCashfree();
    let request = {
      order_amount: 10.0,
      order_currency: "INR",
      order_id: generateOrderId(),
      customer_details: {
        customer_id: "webcodder01",
        customer_phone: "9999999999",
        customer_name: "Web Codder",
        customer_email: "webcodder@example.com",
      },
    };

    Cashfree.PGCreateOrder("2023-08-01", request)
      .then((response) => {
        console.log(response.data);
        res.json(response.data);
      })
      .catch((error : any) => {
        console.error(error.response.data.message);
      });
  } catch (error) {
    console.log(error);
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    initializeCashfree();
    let { orderId } = req.body;

    Cashfree.PGOrderFetchPayments("2023-08-01", orderId)
      .then((response) => {
        console.log(response);
        res.json(response.data);
      })
      .catch((error) => {
        console.error(error.response.data.message);
      });
  } catch (error) {
    console.log(error);
  }
};
