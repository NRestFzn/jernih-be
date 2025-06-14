import jwt from 'jsonwebtoken';
import {env} from '../../common/utils/envConfig';
import {NextFunction, Request, Response} from 'express';
import {UserType} from 'controllers/user/schema';

// Extend Express Request interface to include userLogin
declare global {
  namespace Express {
    interface Request {
      userLogin?: any;
    }
  }
}

async function authorization(req: Request, res: Response, next: NextFunction) {
  const {authorization} = req.headers;
  if (authorization) {
    jwt.verify(
      authorization,
      env.JWT_SECRET_ACCESS_TOKEN,
      async (err, decoded) => {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            res.status(401).json({message: err.message});
            return;
          } else {
            res.status(401).json({message: err.message});
            return;
          }
        } else {
          if (decoded) {
            req.userLogin = decoded;
            next();
          } else {
            res.status(403).json({message: 'Invalid token format'});
            return;
          }
        }
      }
    );
  } else {
    res.status(403).json({message: 'Please login or register first'});
  }
}

// function isPasswordChanged(decoded, dbUser) {
//   if (decoded && dbUser) {
//     let curUser = dbUser.dataValues;
//     if (decoded.password !== curUser.password) {
//       return true;
//     }
//   }
//   return false;
// }

export default authorization;
