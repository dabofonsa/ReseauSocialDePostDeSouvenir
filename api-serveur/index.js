
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import postRoutes from './routes/posts.js'
import userRoutes from './routes/users.js'

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());

app.use('/posts', postRoutes);
app.use('/user', userRoutes);

const CONNECTION_URL = 'mongodb+srv://fonsadabo:123456Test@cluster0.fuzyogi.mongodb.net/?retryWrites=true&w=majority';
const PORT = process.env.PORT || 5002;


mongoose.connect(CONNECTION_URL)
.then(()=>{
    console.log("Serveur Connecté a la BD")
    app.listen(PORT, ()=>console.log(`Le serveur est en écoute sur le port: ${PORT}`))
})
.catch((error)=>console.log(error.message))
