import { useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../utils/config";
// @ts-ignore
import { load } from "@cashfreepayments/cashfree-js";

export const Cashfree = () => {
  let cashfree: any;

  // Initialize Cashfree SDK
  const initializeSDK = async () => {
    cashfree = await load({ mode: "sandbox" });
  };

  // Call initialize on component mount
  useEffect(() => {
    initializeSDK();
  }, []);
  
    // Fetch Payment Session ID from backend
  const getSessionId = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/v1/cashfree`);
      if (response.data && response.data.payment_session_id) {
        return response.data.payment_session_id;
      }
    } catch (error: any) {
      console.error("Error occurred", error);
      throw error; // Propagate error for handling in handleClick
    }
  };

    // Verify payment status
  const verifyPayment = async (orderId: string | null) => {
    try {
      const response = await axios.post(`${backendUrl}/api/v1/cashfree`, {
        orderId,
      });
      if (response.data) {
        return true; 
      }
    } catch (error) {
      console.error("Verification error", error);
      throw error; 
    }
  };

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const sessionId = await getSessionId();

      const checkoutOptions = {
        paymentSessionId: sessionId,
        redirectTarget: "_modal",
      };

      cashfree
        .checkout(checkoutOptions)
        .then(async (orderId: string | null) => {
          console.log("Payment initiated");

          const paymentVerified = await verifyPayment(orderId);

          if (paymentVerified) {
            handleSubmit();
          }
        });
    } catch (error) {
      console.error("Error in handleClick", error);
    }
  };

  const handleSubmit = () => {
    console.log("Now yoou place the order and store data in DB");
  };

  return (
    <div>
      <h1>Cashfree Payment Section</h1>
      <button onClick={handleClick}>Pay with Cashfree</button>
    </div>
  );
};
