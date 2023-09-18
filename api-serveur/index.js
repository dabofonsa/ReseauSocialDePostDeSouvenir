
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

const MONGODB_URL = 'lien de connexion à votre base de données mongoDB';
const PORT = process.env.PORT || 5002;


mongoose.connect(MONGODB_URL)
.then(()=>{
    console.log("Serveur Connecté a la BD")
    app.listen(PORT, ()=>console.log(`Le serveur est en écoute sur le port: ${PORT}`))
})
.catch((error)=>console.log(error.message))
