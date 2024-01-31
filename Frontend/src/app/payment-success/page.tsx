"use client";
import React from "react";
import { useSelector } from "react-redux";
import SuccessLogo from "@/../public/success.png";
import "./index.scss";
import { useRouter } from "next/navigation";

const PaymentSuccessPage: React.FC = () => {
  const navigate = useRouter();
  const user = useSelector((state: any) => state.user);

  const handleContinueShopping = () => {
    navigate.push("/");
  };

  return (
    <div className="payment-success">
      <img src="/success.png" alt="Success Logo" className="success-logo" />

      <h1>Payment Successful!</h1>
      <p>Thank you for your purchase!</p>

      <button onClick={handleContinueShopping}>Continue Shopping</button>
    </div>
  );
};

export default PaymentSuccessPage;
