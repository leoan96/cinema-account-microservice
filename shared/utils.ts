import { v4 as uuidv4 } from 'uuid';
import * as httpContext from 'express-http-context';

export const setCorrelationId = (req, res, next) => {
  const correlationId = uuidv4();
  req.correlationId = correlationId;
  httpContext.set('correlationId', correlationId);
  next();
};
