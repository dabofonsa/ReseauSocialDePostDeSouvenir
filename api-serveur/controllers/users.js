import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.js'

export const signin = async (req, res)=>{
  const {email, password } = req.body;

  try {
    // cherche un user par son email dans la BD 
    const existingUser = await User.findOne({ email });
    
    // si le user recherché dans la BD n'existe pas
    if(!existingUser) return res.status(404).json({message: "User n'existe pas."});

    // cherche un mdp tapé par le user et le compare avec le mdp d'un user existant
    // bcrypt: va intervient si les mdps sont hachés et les va comparer s'ils sont les mêmes 
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

    // si le mdp recherché dans la BD n'existe pas 
    if(!isPasswordCorrect) return res.status(400).json({message: "Identifiants invalides"});
    
    // cherche un user existant et le mdp tapé est correcte
    // 1h sera la durée du token
    const token = jwt.sign({ email: existingUser.email, id: existingUser._id}, 'test', {expiresIn: "1h"});

    res.status(200).json({ result: existingUser, token});
  
  } catch (error) {
    res.status(500).json({ message: "Something went wrong"});
  }

}


export const signup = async (req, res)=>{
  const { email, password, confirmPassword, prenom, nom } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    // si le user recherché dans la BD existe déjà
    if(existingUser) return res.status(404).json({message: "User existe déjà."});
    // si le mdp tapé est different du mdp existant pour le user existant
    if(password !== confirmPassword) return res.status(400).json({ message: " Les Passwords ne correspondent pas."})

    // le mdp du nouveau est haché
    const hashedPassword = await bcrypt.hash(password, 12);

    //créer un user avec son email, mdp haché, son prenom et nom
    const result = await User.create({ email, password: hashedPassword, name: `${prenom}, ${nom}`});

    // cherche un user existant et le mdp tapé est correcte
    // 1h sera la durée du token
    const token = jwt.sign({ email: result.email, id: result._id}, 'test', {expiresIn: "1h"});
    
    res.status(200).json({ result, token});
    
  } catch (error) {
    res.status(500).json({ message: "Something went wrong"});
  }
}