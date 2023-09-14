import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import FileBase from 'react-file-base64';
import { useNavigate } from 'react-router-dom';
import ChipInput from 'material-ui-chip-input';

import useStyles from './styles';
import { createPost, updatePost } from '../../actions/posts';

const Form = ({ currentId, setCurrentId }) => {
 
  const [postData, setPostData] = useState({  title: '', message: '', tags: [], selectedFile: '' });
  const post = useSelector((state) => (currentId ? state.posts.posts.find((message) => message._id === currentId) : null));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const classes = useStyles();
  const user = JSON.parse(localStorage.getItem('profile'));

  useEffect(() => {
    if(!post?.title) clear();
    if (post) setPostData(post);
  }, [post]);

  const clear = () => {
    setCurrentId(0);
    setPostData({ title: '', message: '', tags: [], selectedFile: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentId === 0) {
      dispatch(createPost({...postData, name: user?.result?.name}, navigate));
      clear();
    } else {
      dispatch(updatePost(currentId, {...postData, name: user?.result?.name}));
      clear();
    }
  };

  if(!user?.result?.name){
    return (
      <Paper className={classes.paper} elevation={6}>
      <Typography variant="h6" align="center">
        Veuillez-vous connecter pour créer vos propres souvenirs et aimer ceux des autres.
      </Typography>
    </Paper>
    )
  };

  const handleAdd = (tag) => {
    setPostData({ ...postData, tags: [...postData.tags, tag] });
  };

  const handleDelete = (tagToDelete) => {
    setPostData({ ...postData, tags: postData.tags.filter((tag) => tag !== tagToDelete) });
  };

  return (
    <Paper className={classes.paper} elevation={6}>
      <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
        <Typography variant="h6">{currentId ? `Modification du souvenir "${post?.title}" ` : "Création d'un souvenir" }</Typography>

        <TextField 
          name="title" 
          variant="outlined" 
          label="Titre du souvenir" 
          fullWidth value={postData.title} 
          onChange={(e) => setPostData({ ...postData, title: e.target.value })} 
        />
        <TextField 
          name="message" 
          variant="outlined" 
          label="Message" 
          fullWidth multiline minRows={4} 
          value={postData.message} 
          onChange={(e) => setPostData({ ...postData, message: e.target.value })} 
        />
        
         <div style={{ padding: '5px 0', width: '94%' }}>
          <ChipInput
            name="tags"
            variant="outlined"
            label="Tags"
            fullWidth
            value={postData.tags}
            onAdd={(tag) => handleAdd(tag)}
            onDelete={(tag) => handleDelete(tag)}
          />
        </div>

        <div className={classes.fileInput}>
          <FileBase type="file" multiple={false} 
          onDone={({ base64 }) => setPostData({ ...postData, selectedFile: base64 })} />
        </div>
        <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Valider</Button>
        <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth>Effacer</Button>
      </form>
    </Paper>
  );
};

export default Form;