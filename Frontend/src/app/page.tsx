"use client";
import Books from "@/components/Books";
import styles from "./page.module.scss";
import { useEffect } from "react";
import useCart from "@/customHooks/cartHooks";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setCount } from "@/redux/slices/cartCountSlice";
import { decodeToken, isExpired } from "react-jwt";
import { userLogout } from "@/redux/slices/userSlice";

export default function Home() {
  const { bookData, getCart, cartCount, totalCartCount } = useCart();
  const userId = useSelector((state: any) => state.user.id);
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && isExpired(token)) {
      dispatch(userLogout());
      localStorage.removeItem("token");
    }
    getCart();
  }, []);
  useEffect(() => {
    cartCount();
    dispatch(setCount(totalCartCount));
  }, [bookData]);
  return (
    <main className={styles.main}>
      <ToastContainer />
      <Books />
    </main>
  );
}
