import express, { Request, Response } from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import userModel from "../../model/user/userModel";
import bookModel from "../../model/book/bookModel";
import cartModel from "../../model/cart/cartModel";
import transactionModel from "../../model/transaction/transactionModel";
const jsonwebtoken = require("jsonwebtoken");
import { uuid } from "uuidv4";
import { HTTP_STATUS } from "../../constants/statusCodes";
import { failure, success } from "../../utils/common";
import CartService from "../../services/cart/cart_service";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default class TransactionController {
  static async allTransaction(req: Request, res: Response) {
    try {
      if (!req.headers.authorization)
        return res.status(401).send(failure("Unauthorized Access!"));
      const token = req.headers.authorization.split(" ")[1];
      const check = jsonwebtoken.verify(token, process.env.SECRET_KEY);
      if (!check) throw new Error();

      const user = await userModel.findOne({ email: check.email });
      if (!user)
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(failure("User isn't Found"));
      let trans = await transactionModel
        .find({ user: user._id })
        .populate("user", "-__v -_id")
        .populate("books.book");
      trans = trans.reverse();
      if (trans.length > 0) {
        return res
          .status(200)
          .send(success("All Transactions are Fetched!", trans));
      }
      return res.status(200).send(success("No Transaction is Found!"));
    } catch (error) {
      if (error instanceof jsonwebtoken.TokenExpiredError) {
        return res.status(401).send(failure("Please Login Again!"));
      }
      if (error instanceof jsonwebtoken.JsonWebTokenError) {
        return res.status(401).send(failure("Token Invalid!"));
      }
      return res.status(500).send(failure("Internal Server Error!"));
    }
  }
}
