
// const userSchema=require('../model/userSchema')
// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;

// passport.use(new GoogleStrategy({

// },async (request,accessToken, refreshToken, profile, done) => {

// try {
//   //----------- Extract email from profile -------------------

//  const email = profile.emails[0].value;
//  console.log("email",email)

//   //------------ Check if the user already exists ------------
 
//  let user = await userSchema.findOne({ email })
//  console.log("user",user)
//  if (!user) {
//      user = new userSchema({
//      name: profile.displayName,
//      email : profile.emails[0].value,
//      googleID: profile.id
//  })
//      await user.save()
//  }
//      done(null, user)
//  } catch (err) {
//      done(err, null)
//  }
// }));

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async(id, done) => {
//   try {
//     const user = await userSchema.findById(id)
//     done(null, user)
// } catch (err) {
//     done(err, null)
// } 
// });
   
// module.exports=passport



const passport = require('passport');
//const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy
//require('dotenv').config();
const User = require('../model/userSchema')


passport.use(new GoogleStrategy({
  clientID: '1095042996703-inohst6l75viuroi9e67nd2ms49523pg.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'http://localhost:1233/auth/google/callback'
  
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Find or create user in the database
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = await User.create({
        googleId: profile.id,
        name: profile.displayName,
        email: profile._json.email,
        is_varified: 1 // Set as verified when created through Google
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

// Serialize and deserialize user to manage sessions
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});


