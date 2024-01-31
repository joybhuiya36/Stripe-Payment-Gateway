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
  static async checkoutSession(req: Request, res: Response) {
    try {
      const { userId } = req.body;
      const user = await userModel.findOne({ _id: userId });
      const transId = uuid();
      if (!user)
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(failure("User isn't Found"));
      const userCart = await CartService.viewCart(userId);
      if (!userCart.success) {
        return res
          .status(404)
          .send(failure("Cart is not found for this user!"));
      }
      let totalCost = 0;
      for (const cartItem of userCart.data.books) {
        const bookData = await bookModel.findOne({
          _id: cartItem.book,
        });
        if (bookData) {
          if (bookData.stock < cartItem.quantity) {
            return res.status(401).send(failure("Book is Out of Stock!"));
          }
          totalCost += bookData.price * cartItem.quantity;
        }
      }
      const transaction = await transactionModel.create({
        transId: transId,
        user: user._id,
        books: userCart.data.books,
        total: totalCost,
      });
      const lineItems = userCart?.data?.books.map((book: any) => {
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: book?.book?.title,
              images: [book?.book?.image],
            },
            unit_amount: Math.round(book.book.price * 100),
          },
          quantity: book.quantity,
        };
      });
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.BACKEND_URL}/transaction/payment-success/${transId}`,
        cancel_url: `${process.env.BACKEND_URL}/transaction/payment-fail/${transId}`,
      });
      return res
        .status(200)
        .send(success("Session is Successfully Created", session.url));
    } catch (error) {
      return res.status(500).send(failure("Internal Server Error!"));
    }
  }
  static async paymentSuccess(req: Request, res: Response) {
    try {
      const { transId } = req.params;
      const transaction = await transactionModel.findOne({ transId: transId });
      const userId = transaction.user;

      const userCart = await cartModel.findOne({ user: userId });
      if (!userCart) {
        return res
          .status(404)
          .send(failure("Cart is not found for this user!"));
      }
      for (const cartItem of userCart.books) {
        const bookData = await bookModel.findOne({
          _id: cartItem.book,
        });
        if (bookData) {
          bookData.stock -= cartItem.quantity;
          await bookData.save();
        }
      }
      const deletionResult = await cartModel.deleteOne({ user: userId });
      if (deletionResult.deletedCount) {
        return res.redirect(`${process.env.FRONTEND_URL}/payment-success`);
      }
    } catch (error) {
      return res.status(500).send(failure("Internal Server Error!"));
    }
  }
  static async paymentFailed(req: Request, res: Response) {
    const { transId } = req.params;
    await transactionModel.deleteOne({ transId: transId });
    return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
  }
}
