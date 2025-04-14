import express from 'express'
import dotenv from 'dotenv'
import { connectToDatabase } from './utils/db'

dotenv.config()
const app=express()
connectToDatabase()
const port=process.env.PORT || 8080

app.use(
    cors({
      origin: process.env.BASE_URL,
      credentials: true,
      methods: ["GET", "POST", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

app.get('/', (req,res)=>{
    res.send("Hiie there..........!")
})

app.listen(port, (req,res)=> console.log(`server is listening on port ${port}`))
