import "../App.css";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useState } from "react";
import CheckOutForm from "../components/CheckoutForm";

const stripe = loadStripe(import.meta.env.VITE_SERVER_BASE_URL);
const CustomStripe = () => {
  const [clientsecret, setClientSecret] = useState();
  // const handlePay = (e) => {
  //   e.preventDefault();
  //   setClientSecret(
  //     "pi_3Oym1fKmM04GT7pH0YxUUbDb_secret_UPYCVS4Ykzz29vL2AJ9abCrXK"
  //   );
  // };

  const handlePay = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:4000/api/payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    const data = await response.json();
    console.log(data);
    setClientSecret(data?.result?.clientSecret);
  };

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret: clientsecret,
    appearance,
  };

  return (
    <div className="custom-payment">
      <button onClick={handlePay}>Proceed to pay</button>
      {clientsecret && (
        <Elements options={options} stripe={stripe}>
          <CheckOutForm />
        </Elements>
      )}
    </div>
  );
};
export default CustomStripe;
