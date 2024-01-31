"use client";
import Link from "next/link";
import React from "react";
import CartIcon from "../CartIcon";
import { GrTransaction } from "react-icons/gr";
import "./index.scss";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "@/redux/slices/userSlice";
import { toast } from "react-toastify";

type Props = {};

const Navbar = (props: Props) => {
  const isUser = useSelector((state: any) => state.user.role);
  const navigate = useRouter();
  const dispatch = useDispatch();
  const handleLogout = () => {
    console.log("logout");
    dispatch(userLogout());
    localStorage.removeItem("token");
    toast("Logged Out!");
    navigate.push("/");
  };

  return (
    <div className="nav">
      <Link href="/" className="nav__link">
        Home
      </Link>
      <Link href="/" className="nav__link">
        Books
      </Link>
      <Link href="/" className="nav__link">
        About Us
      </Link>
      <Link href="/" className="nav__link">
        Contact
      </Link>
      <div className="nav__right">
        {isUser == 2 && (
          <span onClick={() => navigate.push("/cart")}>
            <CartIcon />
          </span>
        )}
        {isUser && (
          <span
            onClick={() => navigate.push("/transaction")}
            style={{
              color: "white",
              fontSize: "1.5em",
              paddingRight: "2em",
              cursor: "pointer",
            }}
          >
            <GrTransaction />
          </span>
        )}
        {isUser && (
          <button className="nav__button" onClick={handleLogout}>
            Logout
          </button>
        )}
        {!isUser && (
          <button
            className="nav__button"
            onClick={() => navigate.push("/login")}
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
