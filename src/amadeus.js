import Amadeus from 'amadeus';
import { CLIENT_ID, CLIENT_SECRET } from './config.js';
const amadeus = new Amadeus({
    clientId : CLIENT_ID,
    clientSecret: CLIENT_SECRET,
});

export default amadeus
