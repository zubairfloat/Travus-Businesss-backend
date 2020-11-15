const express = require('express');
const app = express();
var bodyParser = require('body-parser')
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const auth = require('./routes/auth');
const business = require('./routes/business');
const path = require('path');
const review = require('./routes/review');
const venue = require('./routes/venue');
const trip = require('./routes/trip');


app.use(express.static(path.join(__dirname, 'public')));
const port = process.env.PORT || 3001
const mongoDB = 'mongodb+srv://zubair:11223344@cluster0-yync2.mongodb.net/test?retryWrites=true&w=majority'

mongoose
  .connect(
    mongoDB,
    { useNewUrlParser: true, useUnifiedTopology: true},
  )
  .then(() => console.log('DB Connected'))
  .catch(error => {
    console.log('connection error', error.message);
  });
  app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/user', auth);
app.use('/business', business);
app.use('/trip', trip);
app.use('/review', review);
app.use('/venue', venue);
app.listen(port, () => {
  console.log(`SERVER IS RUNNING ON ${port}`);
  
});
