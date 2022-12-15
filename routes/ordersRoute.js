import express from 'express';
import { createOrder, getAllOrders } from '../controllers/ordersController.js';

const route = express.Router();

// get orders

route.get('/', getAllOrders)

// create order

route.post('/', createOrder)


export default route;



