import { Request, Response } from 'express';
import stripe from 'stripe';

const stripeInstance = new stripe(process.env.STRIPE_SECRET!);

export const checkout = async (req: Request, res: Response) => {
  try {
    const { products } = req.body;

    // Validate request body
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Invalid products data" });
    }

    const lineItems = products.map((product: {
      name: string;
      price: number;
      quantity: number;
    }) => {
      // Validate product price
      const price = Number(product.price);
      if (isNaN(price) || price <= 0) {
        throw new Error(`Invalid price for product: ${product.name}`);
      }

      // Convert price to smallest currency unit (cents/paise)
      const unitAmount = Math.round(price * 100);

      return {
        price_data: {
          currency: 'inr',
          product_data: {
            name: product.name,
          },
          unit_amount: unitAmount,
        },
        quantity: product.quantity || 1,
      };
    });

    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:5173/paymentSuccessful',
      cancel_url: 'http://localhost:5173/paymentFailed',
    });

    return res.status(200).json({ id: session.id });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
};