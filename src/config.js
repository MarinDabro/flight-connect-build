import dotenv from 'dotenv'

dotenv.config()

// Exporting the variables 
const MONGOOSE_URL = process.env.URL

const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET

const USER_ID = process.env.USER_ID
const USER_PASS = process.env.USER_PASS

const GOOGLE_KEY = process.env.GOOGLE_KEY

export {MONGOOSE_URL, CLIENT_ID, CLIENT_SECRET, USER_ID, USER_PASS, TOKEN_SECRET_KEY, GOOGLE_KEY }


