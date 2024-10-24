import { Cashfree } from "./pages/Cashfree"
import { Razorpay } from "./pages/Razorpay";
import { Stripe } from "./pages/Stripe";

function App() {

  const handlePaymentSuccess = (response: any) => {
    console.log('Payment successful:', response);
    // Handle success (e.g., redirect to success page)
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment failed:', error);
    // Handle error
  };

  return (
    <>
      <Cashfree/>


      <Razorpay
      amount={1000}
      currency="INR"
      customerName="John Doe"
      customerEmail="john@example.com"
      customerPhone="9999999999"
      onSuccess={handlePaymentSuccess}
      onError={handlePaymentError}
    />


    <Stripe/>
    </>
  )
}

export default App
