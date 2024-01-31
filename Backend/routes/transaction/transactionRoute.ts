import express from "express";
const route = express();
import TransactionController from "../../controller/transaction/transactionController";

route.get("/all", TransactionController.allTransaction);
route.post("/checkout-session", TransactionController.checkoutSession);
route.get("/payment-success/:transId", TransactionController.paymentSuccess);
route.get("/payment-fail/:transId", TransactionController.paymentFailed);

export default route;
