const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const keys = require("../config/keys");

const User = mongoose.model("users");

passport.serializeUser((user, done) => {
  // user is exsitingUser below
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
      callbackURL: "/auth/google/callback",
      proxy: true // fix heroku https->http issue
    },
    async (accessToken, refreshToken, profile, done) => {
      // gets called after exchange token with code from google
      try {
        // console.log(accessToken, refreshToken, profile);  //  refreshToken  used when accessToken expires
        const existingUser = await User.findOne({ googleId: profile.id });
        if (existingUser) {
          return done(null, existingUser);
        }

        const user = await new User({ googleId: profile.id }).save();
        done(null, user);
      } catch (e) {
        console.log(e);
      }
    }
  )
);
