
import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    title: String,
    message: String,
    name: String,
    creator: String,
    tags: [String],
    selectedFile: String,
    likes:{
        type: [String],
        default: [],
    },
    comments: { 
        type: [String], 
        default: [],
    },
    createdAt:{
        type: Date,
        default: new Date()
    }
});

const PostMessage = mongoose.model('PostMessage', postSchema);

export default PostMessage;






//ANCIENNE VERSION AVANT AUTHENTIFICATION
// import mongoose from "mongoose";

// const postSchema = mongoose.Schema({
//     title: String,
//     massage:String,
//     creator:String,
//     tags:[String],
//     selectedFile:String,
//     likeCount:{
//         type:Number,
//         default:0
//     },
//     createAt:{
//         type:Date,
//         default:new Date()
//     }
// });

// const PostMessage = mongoose.model('PostMessage', postSchema);

// export default PostMessage;