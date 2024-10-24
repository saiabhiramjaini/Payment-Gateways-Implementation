import axios from "axios";
import { backendUrl } from "../utils/config";
import { loadStripe } from "@stripe/stripe-js";

interface Product {
  name: string;
  image: string;
  price: number;
  initialQuantity: number;
}

export const Stripe = () => {
  const makePayment = async (product: Product) => {
    const stripe = await loadStripe(
      import.meta.env.VITE_STRIPE_PUBLIC_KEY as string
    );

    try {
      // Validate product data before sending
      if (!product.price || isNaN(product.price)) {
        throw new Error("Invalid product price");
      }

      const productInfo = {
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: product.initialQuantity || 1, // Provide default quantity
      };

      const response = await axios.post(
        `${backendUrl}/api/v1/stripe/create-checkout-session`,
        {
          products: [productInfo],
        }
      );

      if (response.data.id) {
        const result = await stripe?.redirectToCheckout({
          sessionId: response.data.id,
        });
        if (result?.error) {
          throw new Error(result.error.message);
        }
      } else {
        throw new Error("Failed to create Stripe checkout session");
      }
    } catch (error) {
      console.error("Payment error:", error);
      // Handle error appropriately (e.g., show error message to user)
      throw error;
    }
  };

  return (
    <div>
      <h1>Stripe Payment Section</h1>
      <button 
        onClick={() => makePayment({
          name: "Test Product",
          image: "test-image.jpg",
          price: 1000, // Example price
          initialQuantity: 1
        })}
      >
        Pay with Stripe
      </button>
    </div>
  );
};