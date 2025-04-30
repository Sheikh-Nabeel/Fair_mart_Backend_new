import express from "express";
import cors from 'cors';
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

// Ensure you only have one allowed origin from env
const allowedOrigins = [process.env.CORS_ORIGIN, process.env.DASHBOARD_URL].filter(Boolean); // Avoid null/undefined

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests from Postman or mobile apps with no origin
            if (!origin) return callback(null, true);

            // Check if the origin is in the allowedOrigins list
            if (!allowedOrigins.includes(origin)) {
                const msg = `CORS policy does not allow access from origin: ${origin}`;
                return callback(new Error(msg), false); // Reject with an error
            }

            return callback(null, true); // Allow the request
        },
        credentials: true, // Allow cookies to be sent
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // Allowed HTTP methods
        allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'], // Allowed headers
        exposedHeaders: ['Set-Cookie'], // Allow `Set-Cookie` header to be accessible in the response
    })
);

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Middleware to parse cookies
app.use(cookieParser());

// Define the API routes
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

export { app };
export default app; // Export the app for use in other modules