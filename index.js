const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
require('./models/User');
require('./models/Survey');
require('./services/passport'); // authentication flow 

mongoose.connect(keys.mongoURI);

const app = express();

// parse the body and assign to the req.body otherwise req.body will be undefined
app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
app.use(passport.initialize()); // enable cookies
app.use(passport.session());    // alter req and deserialize user

require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);
require('./routes/surveyRoutes')(app);


if (process.env.NODE_ENV === 'production') { 
  // Express will serve up production assets
  // like our main.js file, or main.css file!
  // execute before app.get('*')
  app.use(express.static('client/build'));

  // Express will serve up the index.html file
  // if it doesn't recognize the route
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`running on ${PORT}`);
});
