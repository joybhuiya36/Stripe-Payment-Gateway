"use client";
import React from "react";
import "./index.scss";
import { useRouter } from "next/navigation";

const PaymentFailedPage: React.FC = () => {
  const navigate = useRouter();

  const handleContinueShopping = () => {
    navigate.push("/");
  };

  return (
    <div className="payment-failed">
      <img src="/failed.png" alt="Failed Logo" className="failed-logo" />

      <h1>Payment Failed!</h1>
      <p>Oops! Something went wrong with your payment.</p>

      <button onClick={handleContinueShopping}>Go To Home</button>
    </div>
  );
};

export default PaymentFailedPage;
