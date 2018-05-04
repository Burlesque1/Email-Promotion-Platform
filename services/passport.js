const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser((user, done) => { // user is exsitingUser below
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      // User.findOne({ googleId: profile.id }).then(existingUser => {
      //   if (existingUser) {
      //     // we already have a record with the given profile ID
      //     done(null, existingUser);
      //   } else {
      //     // we don't have a user record with this ID, make a new record!
      //     new User({ googleId: profile.id })
      //       .save()
      //       .then(user => done(null, user));
      //   }
      // });

      try{
        const existingUser = await User.findOne({ googleId: profile.id });
        if(existingUser){
          done(null, existingUser);
        } else {
          const user = await new User({ googleId: profile.id }).save();
          done(null, user);
        }
      } catch (e) {
        console.log(e);
      }
    }
  )
);



