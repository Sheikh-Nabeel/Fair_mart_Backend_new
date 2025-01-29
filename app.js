import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";
import userrouter from './Routes/user.routes.js'
import shoppingitems from './Routes/shoppingitem.routes.js'
 
 
const app=express()
app.use(express.static('public'))

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


app.use('/api/v1/user',userrouter)
app.use('/api/v1/shoppingitems',shoppingitems)
 
 
 


export {app}