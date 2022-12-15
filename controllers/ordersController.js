import OrderCollection from "../models/orderschema.js";
import UserCollection from "../models/usersschema.js";

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await OrderCollection.find();
    res.json({
      success: true,
      data: orders,
    });
  } catch (err) {
    next(err);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const order = new OrderCollection(req.body);
    await order.save();
    const user = await UserCollection.findByIdAndUpdate(
      order.userId,
      { $push: { orders: order._id } },
      { new: true }
    ).populate("orders");

    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
