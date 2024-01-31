import axiosIntance from "@/utils/axiosInstance";
import { useState } from "react";

const useBook = () => {
  const [books, setBooks] = useState<any>([]);
  const getAllBook = () => {
    axiosIntance
      .get("/book/all")
      .then((res) => setBooks(res.data.data))
      .catch((error) => setBooks([]));
  };
  return { books, getAllBook };
};
export default useBook;
