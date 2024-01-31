"use client";
import React, { useEffect, useState } from "react";
import "./index.scss";
import useTransaction from "@/customHooks/transactionHook";

const UserTransaction = () => {
  const { allTrans, getAllTransaction } = useTransaction();
  useEffect(() => {
    getAllTransaction();
  }, []);
  return (
    <div className="transPage">
      <h2>Transactions</h2>
      <div className="allTransDiv">
        {allTrans.map((tran: any, i: number) => (
          <div key={i} className="oneTrans">
            {tran.books.map((book: any, j: number) => (
              <div key={j} className="bookDetails">
                <img src={book.book.image} />
                <div className="nameQuantity">
                  <h4>{book.book.title}</h4>
                  <p>Quantity: {book.quantity}</p>
                </div>
              </div>
            ))}
            <hr />
            <h3>Total: ${tran.total.toFixed(2)}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserTransaction;
