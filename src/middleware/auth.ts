
import bearerToken from 'express-bearer-token';
import jwt from 'jsonwebtoken';

export async function auth(req: any, res: any, next: any) {
  if(req.method === 'OPTIONS') {
    return next();
  }
  bearerToken()(req, res, () => {
    const { token } = req;
    if(!process.env.JWT_SECRET) throw new Error('Missing JWT_SECRET!');
    jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: any) => {
      console.log('data', decoded);
      if(err) {
        //console.log('Got jwt error for token', err);
        return res.status(401).send({
          message: 'Invalid or expired token'
        });
      }
      req.user = decoded;
      next();
    });
  });
};
