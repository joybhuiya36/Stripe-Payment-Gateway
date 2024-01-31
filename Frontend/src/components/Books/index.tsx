"use client";
import useBook from "@/customHooks/bookHook";
import React, { useEffect } from "react";
import BookCart from "../BookCart";
import "./index.scss";
import useCart from "@/customHooks/cartHooks";

type Props = {};

const Books = (props: Props) => {
  const { books, getAllBook } = useBook();
  const { addToCart } = useCart();
  useEffect(() => {
    getAllBook();
  }, []);
  const addtoCart = (id: string) => {
    addToCart(id, 1);
  };
  return (
    <div className="books">
      {books?.map((book: any) => (
        <BookCart
          key={book._id}
          id={book._id}
          title={book.title}
          author={book.author}
          price={book.price}
          image={book.image}
          addtoCart={addtoCart}
        />
      ))}
    </div>
  );
};

export default Books;
