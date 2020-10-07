import passport from 'passport';
import fs from 'fs';

const ClientCertStrategy = require('passport-client-cert').Strategy;

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const privateKey = process.env.JWT_PUBLIC_KEY_PATH ? fs.readFileSync(process.env.JWT_PUBLIC_KEY_PATH).toString() : 's';
passport.use(new JwtStrategy({
  jwtFromRequest: function (req) {
    if(req.headers.authorization){
      return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    } else if (req && req.cookies && req.cookies['jwt']) {
      return req.cookies['jwt'];
    }
    return '';
  },
  secretOrKey: privateKey,
}, function (jwtPayload, done) {
  return done(null, jwtPayload);
}));


passport.use('client-cert', new ClientCertStrategy(function (clientCert, done) {

  const cn = clientCert.subject.cn;
  if (process.env.CLIENT_CERTIFICATES &&
      process.env.CLIENT_CERTIFICATES.includes(cn)) {
    done(null, cn);
  } else {
    done(null, false);
  }
}));

export const optionalAuthentication = (strategy, opts) => {
  if (process.env.DISABLE_AUTHENTICATION === 'true') {
    return (req, res, next) => {
      next();
    };
  }
  console.log('trying to authenticate with strategy ', strategy);
  return passport.authenticate(strategy, {...opts, session: false});
};
