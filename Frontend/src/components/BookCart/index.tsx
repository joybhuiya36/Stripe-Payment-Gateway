import React from "react";
import "./index.scss";
import { FaCartPlus } from "react-icons/fa6";
import { useSelector } from "react-redux";

type Props = {
  id: string;
  title: string;
  author: string;
  price: number;
  image: string;
  addtoCart: Function;
};

const BookCart = ({ id, title, author, price, image, addtoCart }: Props) => {
  const role = useSelector((state: any) => state.user.role);
  return (
    <div className="book-cart">
      <img src={image} alt="Image" className="book-cart__image" />
      <h3 className="book-cart__title">{title}</h3>
      <p className="book-cart__author">{author}</p>
      <p className="book-cart__price">${price}</p>
      {role == 2 && (
        <button className="book-cart__button" onClick={() => addtoCart(id)}>
          <span style={{ fontSize: "15px" }}>Add To Cart</span>
          <span style={{ fontSize: "18px" }}>
            <FaCartPlus />
          </span>
        </button>
      )}
    </div>
  );
};

export default BookCart;
