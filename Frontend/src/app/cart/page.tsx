"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cart from "@/components/CartForCartPage/index";
import "./index.scss";
import axiosIntance from "../../utils/axiosInstance";
import { countZero } from "../../redux/slices/cartCountSlice";
import useCart from "@/customHooks/cartHooks";

const CartPage = () => {
  const { bookData, getCart, totalCost, removeFromCart } = useCart();
  const userId = useSelector((state: any) => state.user.id);
  const dispatch = useDispatch();
  useEffect(() => {
    getCart();
  }, [bookData]);
  const handleCheckout = () => {
    axiosIntance
      .post("/transaction/checkout-session", { userId: userId })
      .then((res) => {
        console.log(res.data);
        const url = res?.data?.data;
        dispatch(countZero(0));
        window.location.replace(url);
      });
  };
  const handleFullRemove = (id: string, quantity: number) => {
    console.log(id, quantity);
    removeFromCart(id, quantity);
  };
  return (
    <div>
      {bookData?.map((x: any) => (
        <Cart
          key={x.book._id}
          id={x.book._id}
          title={x.book.title}
          price={x.book.price}
          image={x.book.image}
          quantity={x.quantity}
          onRemove={handleFullRemove}
        />
      ))}
      <h3 style={{ textAlign: "center", marginBottom: "1em" }}>
        Total: ${totalCost.toFixed(2)}
      </h3>
      <div className="checkoutbtn">
        <button onClick={handleCheckout}>Checkout</button>
      </div>
    </div>
  );
};

export default CartPage;
