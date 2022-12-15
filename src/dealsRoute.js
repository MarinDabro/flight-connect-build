import axios from "axios";
import express from "express";
import { USER_ID, USER_PASS, GOOGLE_KEY } from "./config.js";

const router = express.Router();

const API = `api`;

router.get(`/${API}/deals/info`, async (req, res) => {
  try {
    const dest = JSON.parse(req.query.dest);
    const getDestinationInfo = async () => {
      let gotDestinations = [];
      let count = 0;
      while (count < dest.length) {
        const config = {
          method: "get",
          url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${dest[count]}&type=airport&language=en&key=${GOOGLE_KEY}`,
          headers: {},
        };

        const response = await axios(config).catch(err => console.log(err));

        if (response.data.predictions) {
          gotDestinations.push(response.data.predictions);
        } else {
          gotDestinations.push("");
        }
        count++;
      }
      return gotDestinations;
    };
    const destinations = await getDestinationInfo();

    res.json(destinations);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

router.get(`/${API}/deals/offers`, async (req, res) => {
  let userId = Buffer.from(USER_ID, "utf-8").toString("base64");
  let userPass = Buffer.from(USER_PASS, "utf-8").toString("base64");
  let concat = `${userId}:${userPass}`;
  const encodedConcat = Buffer.from(concat).toString("base64");

  const geoInfo = JSON.parse(req.query.geoInfo);

  try {
    const data = {
      grant_type: "client_credentials",
    };

    const token = await axios.post(
      "https://api-crt.cert.havail.sabre.com/v2/auth/token",
      data,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Basic " + encodedConcat,
        },
      }
    );

    const access = token.data.access_token;

    const countryCode = geoInfo[0].countryCode;
    let query = `origincountry=${countryCode}&topdestinations=10&lookbackweeks=12`;

    const topDestinations = await axios.get(
      `https://api-crt.cert.havail.sabre.com/v1/lists/top/destinations?${query}`,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );

    const getInspiration = async () => {
      let gotFlightInspiration = undefined;
      let count = 0;
      while (gotFlightInspiration === undefined && count < 5) {
        query = `origin=${geoInfo[count].iataCode}&departuredate=${req.query.dateOfDeparture}&returndate=${req.query.dateOfReturn}&pointofsalecountry=${geoInfo[count].countryCode}`;

        const result = await axios.get(
          `https://api-crt.cert.havail.sabre.com/v2/shop/flights/fares?${query}`,
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );
        gotFlightInspiration = result.data;

        count++;
      }
      return gotFlightInspiration;
    };
    const flightInspiration = await getInspiration();

    const getDestinationInfo = async () => {
      let gotDestinations = [];
      let count = 0;
      const input = flightInspiration.FareInfo.slice(0, 5);
      while (count < input.length) {
        const config = {
          method: "get",
          url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input[count].DestinationLocation}&type=airport&language=en&key=${GOOGLE_KEY}`,
          headers: {},
        };

        const response = await axios(config).catch(err => console.log(err));

        if (response.data.predictions) {
          gotDestinations.push(response.data.predictions);
        } else {
          gotDestinations.push("");
        }
        count++;
      }
      return gotDestinations;
    };
    const destinations = await getDestinationInfo();

    // const getDestinationAttractions = async() => {

    //   let gotAttractions = [];
    //   let count = 0;
    //   while (count < destinations.length) {
    //     const geo = `${destinations[count].geometry.location.lat},${destinations[count].geometry.location.lng}`

    //     const config = {
    //       method: 'get',
    //       url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${geo}&radius=40000&type=tourist_attraction&language=en&key=${GOOGLE_KEY}`,
    //       headers: { }
    //     };

    //     const response = await axios(config).catch(err => console.log(err))

    //     gotAttractions.push(response.data.results);

    //     count+=1
    //   }
    //   return gotAttractions
    // }

    // const attractions = await getDestinationAttractions()

    res.json([topDestinations.data, flightInspiration, destinations]);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

export default router;
