"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import "./index.scss";
import axiosIntance from "../../utils/axiosInstance";
import { useDispatch } from "react-redux";
import { userLoginInfo } from "../../redux/slices/userSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useRouter();
  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  const handlerOnSubmit = async () => {
    console.log("Form is submitted ");
    const userData = {
      email: getValues("email"),
      password: getValues("password"),
    };
    const response = await axiosIntance.post("/auth/login", userData);
    if (response.data.success) {
      toast("Login Successful!");
      const token = response.data.data.token;
      console.log(response);
      const info = {
        role: response.data.data.role,
        id: response.data.data.user._id,
        name: response.data.data.user.name,
        email: response.data.data.email,
        address: response.data.data.user.address,
        phone: response.data.data.user.phone,
      };
      console.log(info);
      dispatch(userLoginInfo(info));
      localStorage.setItem("token", token);
      axiosIntance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      navigate.push("/");
      console.log("Logged In!");
    } else {
      setErr(response.data.message);
      console.log("Failed to login!");
    }
  };
  return (
    <div className="modalLogin">
      <div className="modal-content">
        <h1>Login</h1>
        {err.length > 0 && (
          <h4 style={{ color: "red", marginBottom: ".6em" }}>{err}</h4>
        )}
        <form onSubmit={handleSubmit(handlerOnSubmit)}>
          <div>
            <label htmlFor="email">
              Email<span style={{ color: "red" }}>*</span>
            </label>
            <br />
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              }}
              render={({ field }) => (
                <input
                  placeholder="abc@email.com"
                  {...field}
                  style={{ border: errors.email ? "1px solid red" : "" }}
                />
              )}
            />
            {errors.email && (
              <p style={{ color: "red", fontSize: ".9em", marginTop: ".3em" }}>
                {errors.email.message}
              </p>
            )}
          </div>
          <br />
          <div>
            <label htmlFor="password">
              Password<span style={{ color: "red" }}>*</span>
            </label>
            <br />
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum length must be 6",
                },
                maxLength: {
                  value: 20,
                  message: "Max length must be 20",
                },
              }}
              render={({ field }) => (
                <input
                  placeholder="Enter Password"
                  type={showPassword ? "text" : "password"}
                  {...field}
                  style={{ border: errors.password ? "1px solid red" : "" }}
                />
              )}
            />
            <span
              onClick={togglePassword}
              style={{
                position: "absolute",
                cursor: "pointer",
                margin: "6px",
                fontSize: ".85em",
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
            {errors.password && (
              <p style={{ color: "red", fontSize: ".9em", marginTop: ".3em" }}>
                {errors.password.message}
              </p>
            )}
          </div>
          <span
            style={{
              cursor: "pointer",
              margin: "2em",
              fontSize: ".9em",
              textDecoration: "underline",
            }}
          >
            Reset Password
          </span>
          <br />
          <button type="submit" className="login">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
