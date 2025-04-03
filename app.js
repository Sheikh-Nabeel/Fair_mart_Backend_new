import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";
import userrouter from './Routes/user.routes.js'
import shoppingitems from './Routes/shoppingitem.routes.js'
import categoryrouter from './Routes/category.routes.js'
import orderrouter from './Routes/order.routes.js'
import shippingrouter from './Routes/shipping.routes.js'
import eventrouter from './Routes/event.routes.js'

const app=express()
app.use(express.static('public'))

app.use(express.json())
app.use(cors({origin:process.env.CORS_ORIGIN,credentials:true}))
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


app.use('/api/v1/user',userrouter)
app.use('/api/v1/shoppingitems',shoppingitems)
app.use('/api/v1/category',categoryrouter)
app.use('/api/v1/order',orderrouter)
app.use('/api/v1/shipping',shippingrouter)
app.use('/api/v1/event',eventrouter)
 
 


export {app}