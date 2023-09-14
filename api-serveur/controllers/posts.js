import express from 'express';
import mongoose from 'mongoose';

import PostMessage from '../models/postMessage.js';

const router = express.Router();

// View all posts
export const getPosts = async (req, res) => { 
    const {page} = req.query;
    try {
        const LIMIT = 8;
        const startIndex = (Number(page) - 1) * LIMIT; //recupere l'index du debut de chaque page
        
        const total = await PostMessage.countDocuments({});
        const posts = await PostMessage.find().sort({ _id: -1}).limit(LIMIT).skip(startIndex);
                
        res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getPostsBySearch = async (req, res) => {
    const {searchQuery, tags} = req.query;
    try {
        const title = new RegExp(searchQuery, 'i'); // Test ou test ou TEST --> test

        // trouve moi dans tous les posts qui correspondent à l'un de ces critères, le premier est le titre: si le titre est le même que celui nous avons tapé dans le front-end 
        // et le second est l'un des tags du tableau de tags egale à nos tags. Si tel est le cas nous voulons enfin afficher ces publications
        const posts = await PostMessage.find({ $or: [ {title}, { tags: { $in: tags.split(',') } }] });

        res.json({data: posts})
        
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

// View a post by ID
export const getPost = async (req, res) => { 
    const { id } = req.params;

    try {
        const post = await PostMessage.findById(id);
        
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

// Create the post
export const createPost = async (req, res) => {
    const post = req.body;

    const newPostMessage = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() })

    try {
        await newPostMessage.save();

        res.status(201).json(newPostMessage );
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}
// Update the post
export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, message, creator, selectedFile, tags } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const updatedPost = { creator, title, message, tags, selectedFile, _id: id };

    await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

    res.json(updatedPost);
}

// Delete the post
export const deletePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    await PostMessage.findByIdAndRemove(id);

    res.json({ message: "Post deleted successfully." });
}

// Like the post
export const likePost = async (req, res) => {
    const { id } = req.params;

// si un user n'est pas authentifié est veut aimer un post
    if(!req.userId) {
        return res.json({ message: "Unauthenticated"});
    } 

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    
    const post = await PostMessage.findById(id);

    //on verifie si le user est dans une section pour pouvoir aimer ou pas
    const index = post.likes.findIndex((id) => id === String(req.userId));
    if(index === -1){
        //peut aimer le post
        post.likes.push(req.userId);
    }else{
        // ne paut pas aimer le post
        post.likes = post.likes.filter((id) => id !== String(req.userId));
    }

    // const updatedPost = await PostMessage.findByIdAndUpdate(id, { likeCount: post.likeCount + 1 }, { new: true });

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
    
    res.json(updatedPost);
}

// commenter un post
export const commentPost = async (req, res)=>{
    const { id } = req.params;
    const { value } = req.body;

    const post = await PostMessage.findById(id);
    post.comments.push(value);

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true});

    res.json(updatedPost);
}




export default router;