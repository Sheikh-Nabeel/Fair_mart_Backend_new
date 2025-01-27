import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";
import userrouter from './Routes/user.routes.js'
import profilerouter from './Routes/profile.routes.js'
import analticsrouter from './Routes/analytics.routes.js'
 
const app=express()

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


app.use('/api/v1/user',userrouter)
app.use('/api/v1/profile',profilerouter)
app.use('/api/v1/analytics',analticsrouter)
 
 


export {app}