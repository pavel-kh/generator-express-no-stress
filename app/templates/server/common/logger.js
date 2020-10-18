import pino from 'pino';

import { clsProxifyExpressMiddleware } from 'cls-proxify/integration/express';
import { clsProxify } from 'cls-proxify';

const ph = require('pino-http');

const l = pino({
  name: process.env.APP_ID,
  level: process.env.LOG_LEVEL,
  timestamp: pino.stdTimeFunctions.isoTime,
  messageKey: 'message',
  useLevelLabels: true,
});

export const expressLoggerClsMiddleware = clsProxifyExpressMiddleware('clsKeyLogger', req => {
  const requestId = req.headers['x-request-id'];
  return l.child({ requestId });
});
const loggerCls = clsProxify('clsKeyLogger', l);

export const pinoHttp = ph({
  autoLogging: {
    ignorePaths: ['/healthcheck/ping'],
  },
  logger: l,
});
export default loggerCls;
