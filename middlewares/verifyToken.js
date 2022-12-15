import jwt from 'jsonwebtoken';
import UserCollection from '../models/usersschema.js';
import { TOKEN_SECRET_KEY } from '../src/config.js';

async function verifyToken(req, res, next) {
  try {
    const {token} = req.headers;

    const payload = jwt.verify(token, TOKEN_SECRET_KEY);

    const user = await UserCollection.findById(payload._id);
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

export default verifyToken;
