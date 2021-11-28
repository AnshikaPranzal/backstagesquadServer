require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
//My Routes
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/event');
const speakerRoutes = require('./routes/speaker');
const durationRoutes = require('./routes/duration');
const venueRoutes = require('./routes/venue');
const searchRoutes = require('./routes/search');
const ideaRoutes = require('./routes/idea');

//Connecting Mongoose-mongodb
mongoose
  .connect('mongodb+srv://admin:admin0987@cluster0.rmiv2.mongodb.net/eventManager', {
    useNewUrlParser: true,
    useUnifiedTopology: true  })  
  .then((obj) => {
    console.log('MongoDB Connected...');
  })
  .catch((err) => {
    console.log('Problem Logging DB...'+err);
    throw err;
  });

//connecting the middlewares

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
// app.use(cors(`http://localhost:3000/`));

app.get('/api/hey',()=>{console.log("hey")})

//My routes
app.use('/api', authRoutes);
app.use('/api', eventRoutes);
app.use('/api', speakerRoutes);
app.use('/api', durationRoutes);
app.use('/api', venueRoutes);
app.use('/api', searchRoutes);
app.use('/api', ideaRoutes);

const port = process.env.PORT || 8001;

app.listen(port, () => {
  console.log(`Listening on Port: ${port}`);
});

