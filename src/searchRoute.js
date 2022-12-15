import amadeus from './amadeus.js';
import express from 'express';



const router = express.Router();

const API = `api`;


router.get(`/${API}/offers`, async(req, res) =>{
    const {originCode, destinationCode, dateOfDeparture, dateOfReturn, adults, children} = req.query
    
    if (dateOfReturn === '') {
      try{
          const response = await amadeus.shopping.flightOffersSearch.get({
              originLocationCode: originCode,
              destinationLocationCode: destinationCode,
              departureDate: dateOfDeparture,
              adults: adults,
              children: children,
              max: 20
          })
          res.json(JSON.parse(response.body))
      }catch(err){
          res.json(err)
      }
    } else {
      try{
          const response = await amadeus.shopping.flightOffersSearch.get({
              originLocationCode: originCode,
              destinationLocationCode: destinationCode,
              departureDate: dateOfDeparture,
              returnDate: dateOfReturn,
              adults: adults,
              children: children,
              max: 20
          })
          res.json(JSON.parse(response.body))
      }catch(err){
        console.log(err.description)
          res.json(err)
      }

    }
})

export default router
