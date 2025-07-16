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

const visaConfigRoutes = require('./router/visaConfiq');
const admin = require('./router/admin');
 const VisaApplication = require('./router/VisaApplication');

  const paymentRoutes = require('./router/payment');
  const User = require('./router/User');
    const promocode = require('./router/promocode');
     const employee = require('./router/employee');
        const manager = require('./router/manager');


const app = express();
app.use(cookieParser());


app.use(hpp());
// 1) GLOBAL MIDDLEWARES

// Enable CORS
const allowedOrigins = [


 
   'https://govisaa-83693.web.app',
   'http://localhost:5173',

 
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
  max: 1000, // pehle 100 tha, ab 1000 kar diya
  windowMs: 60 * 60 * 1000, // 1 ghanta
  message: 'Too many requests from this IP, please try again in an hour!'
});

app.use('/api', limiter);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));



// Error Handling Middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});





app.use('/api/configurations', visaConfigRoutes);

app.use('/api/admin', admin);
 app.use('/api/VisaApplication', VisaApplication);

  app.use('/api/User',  User);



app.use('/api/payments', paymentRoutes);

app.use('/api/promocode', promocode);
app.use('/api/employee', employee);
app.use('/api/manager', manager);
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

app.use(express.json());



module.exports = app;
