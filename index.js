import dotenv from 'dotenv'
import {app} from './app.js'
import { connectdb } from './db/dbconnection.js'

let port =process.env.PORT || 8000

dotenv.config({
    path:"/.env"
})

connectdb()
.then(()=>{
    app.listen(port,()=>{
        console.log(`Server is running at Port : ${port}`)
    })
}).catch((err)=>{
    console.log(`Mongodb connection error :${err}`)
})