import express from "express";
const route = express();
import TransactionController from "../../controller/transaction/transactionController";

route.get("/all", TransactionController.allTransaction);

export default route;
