"use client";
import React, { useState } from "react";
import "./index.scss";
import useCart from "@/customHooks/cartHooks";

type Props = {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  onRemove: Function;
};
const CartForCartPage = ({
  id,
  title,
  price,
  image,
  quantity,
  onRemove,
}: Props) => {
  const [count, setCount] = useState(quantity);
  const { addToCart, removeFromCart } = useCart();
  return (
    <div className="cart-for-cartpage">
      <div className="left">
        <img src={image} height={100} />
      </div>
      <div className="right">
        <h4>{title}</h4>
        <p>${price}</p>
        <div className="plusminus">
          <button
            onClick={() => {
              removeFromCart(id, 1);
              setCount(count - 1);
            }}
            disabled={count == 0}
          >
            -
          </button>
          {count}
          <button
            onClick={() => {
              addToCart(id, 1);
              setCount(count + 1);
            }}
          >
            +
          </button>
        </div>
      </div>
      <span className="close" onClick={() => onRemove(id, count)}>
        X
      </span>
    </div>
  );
};

export default CartForCartPage;
