import React, { useEffect, useState } from 'react'
import useStyles from './styles.js'

import { Typography, AppBar, Toolbar, Avatar, Button } from '@material-ui/core';
import {Link, useNavigate} from 'react-router-dom';
import { useLocation } from 'react-router-dom';
// import memories from '../../images/memories.png';
import memoriesLogo from '../../images/memoriesLogo.png';
import memoriesText from '../../images/memoriesText.png';
import { useDispatch } from 'react-redux';
import * as actionType from '../../constants/actionTypes';
import decode from "jwt-decode";

const Navbar = () => {
  const classes = useStyles();
  const  [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
 

    // // fonction logout
   const logout = () => {
    dispatch({ type: actionType.LOGOUT });

    navigate('/auth');

    setUser(null);
  };

useEffect(() =>{
  const token = user?.token;
  // JWT...
  //vérification si le token à expiré
  if(token){
    const decodedToken = decode(token);
    if(decodedToken.exp * 1000 < new Date().getTime()) logout();
  }

  setUser(JSON.parse(localStorage.getItem('profile'))); 
}, [location])
// }, [user?.token])


///////////////////////////
// useEffect(() =>{
//   const token = user?.token;
//   // JWT...
//   //vérification si le token à expiré

// }, [location])
///////////////////////////

// useEffect(() =>{
//   if(user?.token) {
//     // JWT...
//   setUser(JSON.parse(localStorage.getItem('profile')));
//   } 
// }, [user?.token])


  return (
    <AppBar className={classes.appBar} position="static" color="inherit">

        <Link to="/" className={classes.brandContainer}>
          <img component={Link} to="/" src={memoriesText} alt="icon" height="45px" />
          <img className={classes.image} src={memoriesLogo} alt="icon" height="40px" />
        </Link>  
                
        <Toolbar className={classes.toolbar}>
          {user?.result ? (
            <div className={classes.profile}>
              <Avatar className={classes.purple} alt={user?.result.name} src= {user?.result.imageURL}>{user?.result.name.charAt(0)}</Avatar>
              <Typography className={classes.userName} variant="h6">{user?.result.name}</Typography>
              <Button variant="contained" className={classes.logout} color="secondary" onClick={logout}>Déconnecter</Button>
            </div>
          ) : (
            <Button component={Link} to="/auth" variant="contained" color="primary">Connecter</Button>
          )}
        </Toolbar>
    </AppBar>
  )
}

export default Navbar