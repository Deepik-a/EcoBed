const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
  clientID: '1095042996703-inohst6l75viuroi9e67nd2ms49523pg.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'http://localhost:1233/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
;
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  done(null, { id }); 
});
