import amadeus from "./amadeus.js";
import express from "express";

const router = express.Router();

const API = `api`;

router.get(`/${API}/booking/price`, async (req, res) => {
  try {
    const offer = JSON.parse(req.query.offer);

    const response = await amadeus.shopping.flightOffers.pricing.post(
      JSON.stringify({
        data: {
          type: "flight-offers-pricing",
          flightOffers: [offer],
        },
      })
    );

    res.json(JSON.parse(response.body));
  } catch (err) {
    console.log(err.description);
    res.json(err);
  }
});

router.post(`/${API}/booking/order`, async (req, res) => {
  try {
    const flight = req.body.order;
    const travelers = req.body.travelers;

    const response = await amadeus.booking.flightOrders.post(
      JSON.stringify({
        data: {
          type: "flight-order",
          flightOffers: [flight],
          travelers: travelers,
          remarks: {
            general: [
              {
                subType: "GENERAL_MISCELLANEOUS",
                text: "Flight Connect",
              },
            ],
          },
          ticketingAgreement: {
            option: "DELAY_TO_CANCEL",
            delay: "6D",
          },
          contacts: [
            {
              addresseeName: {
                firstName: "Flight",
                lastName: "Connect",
              },
              companyName: "Flight Connect",
              purpose: "STANDARD",
              phones: [
                {
                  deviceType: "MOBILE",
                  countryCallingCode: "49",
                  number: "480080072",
                },
              ],
              emailAddress: "support@flight-connect.com",
              address: {
                lines: ["Yorckstr, 1"],
                postalCode: "40476",
                cityName: "Desseldorf",
                countryCode: "DE",
              },
            },
          ],
        },
      })
    );
    res.json(response);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

export default router;
