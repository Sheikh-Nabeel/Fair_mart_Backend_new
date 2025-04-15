import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";
import userrouter from './Routes/user.routes.js'
import shoppingitems from './Routes/shoppingitem.routes.js'
import categoryrouter from './Routes/category.routes.js'
import orderrouter from './Routes/order.routes.js'
import shippingrouter from './Routes/shipping.routes.js'
import eventrouter from './Routes/event.routes.js'
import aboutrouter from './Routes/about.routes.js'
import achievementrouter from './Routes/achievement.routes.js'
import bannerrouter from './Routes/banner.routes.js'
import salesrouter from './Routes/sales.routes.js'
import reviewsrouter from './Routes/reviews.routes.js'
const app=express()
app.use(express.static('public'))

app.use(express.json())
const allowedOrigins = [process.env.CORS_ORIGIN, process.env.DASHBOARD_URL];

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps or Postman)
            if (!origin) return callback(null, true);

            if (!allowedOrigins.includes(origin)) {
                const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
                return callback(new Error(msg), false);
            }

            return callback(null, true);
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
        exposedHeaders: ['Set-Cookie']
    })
);
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


app.use('/api/v1/user',userrouter)
app.use('/api/v1/shoppingitems',shoppingitems)
app.use('/api/v1/category',categoryrouter)
app.use('/api/v1/order',orderrouter)
app.use('/api/v1/shipping',shippingrouter)
app.use('/api/v1/event',eventrouter)
app.use('/api/v1/about',aboutrouter)
app.use('/api/v1/achievement',achievementrouter)
app.use('/api/v1/banner',bannerrouter)
app.use('/api/v1/sales',salesrouter)
app.use('/api/v1/reviews',reviewsrouter)
 


export {app}