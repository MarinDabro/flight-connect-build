
import { GOOGLE_KEY } from './config.js';
import GooglePlacesApi from 'dcts-google-places-api';
const apiKey = GOOGLE_KEY;
const googleapi = new GooglePlacesApi(apiKey)

export default googleapi
