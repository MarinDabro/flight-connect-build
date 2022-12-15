import amadeus from './amadeus.js';
import express from 'express';

const router = express.Router();

const API = `api`;

router.get(`/${API}/local-airport`, async(req, res) => {
  const {latitude, longitude} = req.query

  try{
      const response = await amadeus.client.get('/v1/reference-data/locations/airports', {
          latitude: latitude,
          longitude: longitude
      })
      res.json(JSON.parse(response.body))
  }catch(err){
    console.log(err.description)
    res.json(err)
  }
})

export default router;
