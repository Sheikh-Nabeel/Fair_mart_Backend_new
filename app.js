import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userrouter from './Routes/user.routes.js';
import shoppingitems from './Routes/shoppingitem.routes.js';
import categoryrouter from './Routes/category.routes.js';
import orderrouter from './Routes/order.routes.js';
import shippingrouter from './Routes/shipping.routes.js';
import eventrouter from './Routes/event.routes.js';
import aboutrouter from './Routes/about.routes.js';
import achievementrouter from './Routes/achievement.routes.js';
import bannerrouter from './Routes/banner.routes.js';
import salesrouter from './Routes/sales.routes.js';
import reviewsrouter from './Routes/reviews.routes.js';

const app = express();

// Serve static files from the "public" directory
app.use(express.static('public'));

// Middleware to parse JSON bodies
app.use(express.json());
console.log(process.env);  // Log all environment variables (optional)

// Hardcode CORS URLs
const allowedOrigins = [
  'https://24sevenfairmart.com',        // CORS_ORIGIN
  'https://dashboard.24sevenfairmart.com'  // DASHBOARD_URL
];

// Debugging check: Print out the allowed origins
console.log("Allowed Origins:", allowedOrigins);

// CORS Configuration with additional debugging
app.use(
  cors({
    origin: function (origin, callback) {
      console.log('Received Origin:', origin); // Debugging: Log the incoming origin

      // Allow requests with no origin (Postman, mobile apps, etc.)
      if (!origin) {
        console.log('No origin provided (likely Postman or mobile app)');
        return callback(null, true);
      }

      // Debugging: Check if the origin is in the allowed list
      if (!allowedOrigins.includes(origin)) {
        const msg = `CORS policy does not allow access from origin: ${origin}`;
        console.error(msg); // Debugging: Log the error if origin is not allowed
        return callback(new Error(msg), false); // Reject the request
      }

      console.log('Origin is allowed:', origin); // Debugging: Confirm the origin is allowed
      return callback(null, true); // Allow the request
    },
    credentials: true, // Allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'], // Allowed headers
    exposedHeaders: ['Set-Cookie'], // Expose cookies to frontend
  })
);

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Middleware to parse cookies
app.use(cookieParser());

// API routes
app.use('/api/v1/user', userrouter);
app.use('/api/v1/shoppingitems', shoppingitems);
app.use('/api/v1/category', categoryrouter);
app.use('/api/v1/order', orderrouter);
app.use('/api/v1/shipping', shippingrouter);
app.use('/api/v1/event', eventrouter);
app.use('/api/v1/about', aboutrouter);
app.use('/api/v1/achievement', achievementrouter);
app.use('/api/v1/banner', bannerrouter);
app.use('/api/v1/sales', salesrouter);
app.use('/api/v1/reviews', reviewsrouter);

// Start the server
export { app };
