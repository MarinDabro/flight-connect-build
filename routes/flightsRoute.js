import express from 'express';
import { createFlight, deleteFlight, getAllFlights } from '../controllers/flightController.js';
import verifyToken from '../middlewares/verifyToken.js'

const route = express.Router();

//===> get all flights

route.get('/' , verifyToken, getAllFlights);

//===> Create flight

route.post('/', verifyToken, createFlight)

// ===> delete flight

route.delete('/:id', verifyToken, deleteFlight)


export default route;