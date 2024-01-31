import { decreaseMany, increase } from "@/redux/slices/cartCountSlice";
import axiosIntance from "@/utils/axiosInstance";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const useCart = () => {
  const [bookData, setBookData] = useState<any>([]);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [totalCartCount, setTotalCartCount] = useState<number>(0);
  const dispatch = useDispatch();
  const getCart = () => {
    axiosIntance
      .get("/cart/view")
      .then((res) => {
        setBookData(res.data.data.books);
        setTotalCost(res.data.data.total);
      })
      .catch((error) => {
        setBookData([]);
        setTotalCost(0);
      });
  };
  const cartCount = () => {
    setTotalCartCount(
      bookData.reduce((sum: number, book: any) => sum + book.quantity, 0)
    );
  };
  const addToCart = (id: string, quantity: number) => {
    axiosIntance
      .post("/cart/addtocart", { bookId: id, quantity: 1 })
      .then((res) => {
        getCart();
        toast.success("Book is added to cart");
        dispatch(increase());
      })
      .catch((error) => {
        toast.error("Failed to add to cart");
      });
  };
  const removeFromCart = (id: string, quantity: number) => {
    axiosIntance
      .post("/cart/remove", { bookId: id, quantity: quantity })
      .then((res) => {
        getCart();
        toast.success("Book is Reduced from the cart");
        dispatch(decreaseMany(quantity));
      })
      .catch((error) => {
        toast.error("Failed to Remove from the cart");
      });
  };
  return {
    bookData,
    getCart,
    totalCost,
    cartCount,
    totalCartCount,
    addToCart,
    removeFromCart,
  };
};

export default useCart;
