import amadeus from './amadeus.js';
import express from 'express';


const router = express.Router(); //===> require ("express").Router

const API = `api`;

router.get(`/${API}/airports`, async (req, res) => {
  const { page, subType, keyword } = req.query;

  try {
    const response = await amadeus.client.get('/v1/reference-data/locations', {
      keyword,
      subType,
      'page[offset]': page * 10,
    });

    res.json(JSON.parse(response.body));

  } catch (err) {
    console.log(err.description)

    res.json(err);
  }
});

export default router;
