import axios from "axios";
import { useState } from "react";
import { backendUrl } from "../utils/config";

interface RazorpayProps {
  amount?: number;
  currency?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  onSuccess?: (response: PaymentSuccessResponse) => void;
  onError?: (error: any) => void;
}

interface PaymentSuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const Razorpay = ({
  amount = 100,
  currency = "INR",
  customerName = "",
  customerEmail = "",
  customerPhone = "",
  onSuccess,
  onError,
}: RazorpayProps) => {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError("");


// Create order on your backend
const orderResponse = await axios.post(`${backendUrl}/api/v1/razorpay/create-order`, {
  amount,
  currency,
  receipt: "order_" + Date.now(),
}, {
  headers: {
    "Content-Type": "application/json",
  }
});

// Access the order data directly
const orderData = orderResponse.data;


      if (!orderData.success) {
        throw new Error(orderData.message || "Failed to create order");
      }

      // Initialize Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Your Company Name",
        description: "Payment for your order",
        order_id: orderData.order.id,
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        handler: async function (response: PaymentSuccessResponse) {
          try {
            // Verify payment on your backend
            const verifyResponse = await axios.post(`${backendUrl}/api/v1/razorpay/verify`, {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }, {
                headers: {
                  "Content-Type": "application/json",
                }
              });

              const verifyData = verifyResponse.data;

            if (verifyData.success) {
              onSuccess?.(response);
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error) {
            setError("Payment verification failed");
            onError?.(error);
          }
        },
        theme: {
          color: "#3B82F6",
        },
      };

      // Initialize Razorpay
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Payment failed");
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Razorpay Payment Section</h1>

      <button onClick={handlePayment}>{`Pay with Razorpay`}</button>
    </div>
  );
};
