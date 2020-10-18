import Express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as os from 'os';
import cookieParser from 'cookie-parser';
import './axios';

import * as https from 'https';
import passport from 'passport';
import fs from 'fs';
import l, {pinoHttp, expressLoggerClsMiddleware} from './logger';
import oas from './oas';

const app = new Express();
const {exit} = process;

export default class ExpressServer {
  constructor() {
    const root = path.normalize(`${__dirname}/../..`);
    app.set('appPath', `${root}client`);
    app.use(bodyParser.json({limit: process.env.REQUEST_LIMIT || '100kb'}));
    app.use(bodyParser.urlencoded({
      extended: true,
      limit: process.env.REQUEST_LIMIT || '100kb',
    }));
    app.use(bodyParser.text({limit: process.env.REQUEST_LIMIT || '100kb'}));
    app.use(cookieParser(process.env.SESSION_SECRET));
    app.use(expressLoggerClsMiddleware);
    app.use(pinoHttp);
    app.use(Express.static(`${root}/public`));
    app.use(passport.initialize());
  }

  router(routes) {
    this.routes = routes;
    return this;
  }

  listen(port = process.env.PORT) {
    const welcome = p => () => l.info(
        `up and running in ${process.env.NODE_ENV
        || 'development'} @: ${os.hostname()} on port: ${p}}`,
    );

    oas(app, this.routes)
        .then(() => {
          if (process.env.USE_HTTPS) {
            https.createServer({
              key: fs.readFileSync(process.env.SERVER_KEY),
              cert: fs.readFileSync(process.env.SERVER_CERT),
              ca: fs.readFileSync(process.env.SERVER_CA),
            }, app)
                .listen(port, welcome(port));
          } else {
            http.createServer(app)
                .listen(port, welcome(port));
          }
        })
        .catch(e => {
          l.error(e);
          exit(1);
        });

    return app;
  }
}
