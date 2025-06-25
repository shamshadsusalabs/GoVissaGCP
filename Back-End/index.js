require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
// const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const connectDB = require('./dbConnection/mongooseConnect');
const visaConfigRoutes = require('./router/visaConfiq');
const admin = require('./router/admin');
 const VisaApplication = require('./router/VisaApplication');

  const paymentRoutes = require('./router/payment');
  const User = require('./router/User');
    const promocode = require('./router/promocode');
     const employee = require('./router/employee');

connectDB();
const app = express();

// 1) GLOBAL MIDDLEWARES

// Enable CORS
const allowedOrigins = [


 
   'https://govisaa-83693.web.app',

 
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Allow mobile apps with no origin
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));


// Set security HTTP headers
app.use(helmet());


// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
// app.use(mongoSanitize());

// Data sanitization against XSS
// app.use(xss());

// Prevent parameter pollution
app.use(hpp());




app.use('/api/configurations', visaConfigRoutes);

app.use('/api/admin', admin);
 app.use('/api/VisaApplication', VisaApplication);

  app.use('/api/User',  User);



app.use('/api/payments', paymentRoutes);

app.use('/api/promocode', promocode);
app.use('/api/employee', employee);
// Test route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Visa Configuration API is running'
  });
});



// 5) START SERVER
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', err => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', err => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;
