import passport from 'passport';
import awsService from '../api/services/aws.service';

const ClientCertStrategy = require('passport-client-cert').Strategy;

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;


awsService.getHttpsCertificates().then(secret => {
  const jwtPublic = Buffer.from(secret['jwt-public'], 'base64').toString();

  passport.use('jwt', new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtPublic
  }, function (jwt_payload, done) {
    return done(null, jwt_payload);
  }));
})


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
