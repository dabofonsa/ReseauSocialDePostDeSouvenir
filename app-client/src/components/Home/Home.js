import { Container, Grid, Grow, AppBar, TextField, Button} from '@material-ui/core'
import { Paper } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import Posts from '../Posts/Posts'
import Form from '../Form/Form'
import { useDispatch } from 'react-redux'
import { getPosts, getPostsBySearch } from '../../actions/posts';
// import { getPostsBySearch } from '../../actions/posts';
import Pagination from '../Paginantion'
import useStyles from './styles'
import ChipInput from 'material-ui-chip-input'


function useQuery(){
  return new URLSearchParams(useLocation().search);
}

const Home = () => {

  const classes = useStyles();
  const query = useQuery();
  const page = query.get('page') || 1;
  const searchQuery = query.get('searchQuery');

  const [currentId, setCurrentId] = useState(0);
  const dispatch = useDispatch();

  const [search, setSearch] = useState('');
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();

  // useEffect(() => {
  //   dispatch(getPosts());
  // }, [currentId, dispatch]);

  const searchPost = () => {
    if(search.trim() || tags){
      dispatch(getPostsBySearch({ search, tags: tags.join(',') }))
      navigate(`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`);
    }else{
      // history.push('/');
      navigate('/');
    }
  }

  const handleKeyPress = (e)=>{
    if(e.keyCode === 13){
      searchPost();
    }
  }

  const handleAdd = (tag) => setTags([...tags, tag]);

  const handleDelete = (tagToDelete) => setTags(tags.filter((tag) => tag !== tagToDelete));

  return (
    <Grow in>
        <Container maxWidth="xl">
          <Grid container justifyContent="space-between" alignItems="stretch" spacing={3} className={classes.gridContainer}>
            <Grid item xs={12} sm={6} md={9}>
              <Posts setCurrentId={setCurrentId} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <AppBar className={classes.appBarSearch} position='static' color='inherit'>
                <TextField 
                  name='search'
                  variant='outlined'
                  label='Recherche de souvenirs' 
                  onKeyDown={handleKeyPress}
                  fullWidth value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <ChipInput
                  style={{ margin: '10px 0' }}
                  value={tags}
                  onAdd={ handleAdd}
                  onDelete={ handleDelete}
                  // onAdd={(tag) => handleAdd(tag)}
                  // onDelete={(tag) => handleDelete(tag)}
                  label="Recherche de Tags"
                  variant='outlined'
                />
                <Button onClick={searchPost} className={classes.searchButton} variant='contained' color='primary'>Rechercher</Button>
              </AppBar>
              <Form currentId={currentId} setCurrentId={setCurrentId} />
              {(!searchQuery && !tags.length) && (
                <Paper elevation={6} className={classes.pagination}>
                <Pagination page={page} />
              </Paper>
              )}
              
            </Grid>
          </Grid>
        </Container>
      </Grow>
  );
};
  
export default Home