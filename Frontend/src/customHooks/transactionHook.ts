import axiosIntance from "@/utils/axiosInstance";
import { useState } from "react";

const useTransaction = () => {
  const [allTrans, setAllTrans] = useState<any>([]);

  const getAllTransaction = () => {
    axiosIntance
      .get("/transaction/all")
      .then((res) => {
        console.log(res.data.data);
        setAllTrans(res.data.data);
      })
      .catch((error) => setAllTrans([]));
  };
  return { allTrans, getAllTransaction };
};

export default useTransaction;
