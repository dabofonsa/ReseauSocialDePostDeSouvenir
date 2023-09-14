

import React, { useState } from 'react'

// dans react-router-dom6 'useHistory' est remplacé par 'useNavigate'
// import { useHistory } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { GoogleLogin} from 'react-google-login';
import Icon from './icon.js';
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import useStyles from './styles';
import InputUser from './InputUser.js';
import { useDispatch } from 'react-redux';
import { signup, signin } from '../../actions/auth.js';



const initialState = { prenom: "", nom: "", email: "", password: "", confirmPassword: "" };

const Auth = () => {
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  // const history = useHistory();
  const navigate = useNavigate();

  //if it off, turn on. if it on, turn off.
  const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

  const handlesubmit = (e)=>{
    e.preventDefault();
    if(isSignup){
      dispatch(signup(formData, navigate))
    }else{
      dispatch(signin(formData, navigate))
    }
    
  };

  const handleChange = (e)=>{
    setFormData({ ...formData, [e.target.name]: e.target.value})
  };

  const switchMode = () => {
    setIsSignUp((prevIsSignUp) => !prevIsSignUp);
    // handleShowPassword(false);
    setShowPassword(false);
  }

  const googleSuccess = async (res) =>{
    const result = res?.profileObj;
    const token = res?.tokenId;
    
    try{
      dispatch({ type: 'AUTH', data: {result, token} });
      // history.push("/"); // dans react-router-dom6 'history' est remplacé par 'navigate'
      // navigate.push('/');
      navigate('/');

    }catch(error){
      console.log(error)
    }
  }

  

  const googleFailure = (error) =>{
    console.log(error)
    console.log('La connexion à Google a échoué. Réessayez plus tard')
  }

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon/>
        </Avatar>
        <Typography variant="h5">{isSignup ? "S'Inscrire" : "Se Connecter" }</Typography>
        <form className={classes.form} onSubmit={handlesubmit}>
          <Grid container spacing={2}>
            {
              isSignup && (
                <>
                  <InputUser name="prenom" label="Prénom" handleChange={handleChange} autoFocus half/>
                  <InputUser name="nom" label="Nom" handleChange={handleChange} half/>      
                </>
              )
            }
            <InputUser name="email" label="Email Address" handleChange={handleChange} type="email"/>
            <InputUser name="password" label="PassWord" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword}/>
            { isSignup && <InputUser name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password"/>}
          </Grid>
          
          <Button type="submit" fullWidth variant="contained" color="primary" className="classes.submit">
            { isSignup ? "S'Inscrire" : "Se Connecter"}
          </Button>
          <GoogleLogin 
            clientId="IDENTIFIANT_GOOGLE"
            render={(renderProps) => (
              <Button 
                className={classes.googleButton} 
                color="primary" 
                fullWidth 
                onClick={renderProps.onClick} 
                disabled={renderProps.disabled} 
                startIcon={<Icon />} 
                variant="contained">
                  Connectez-vous avec Google
              </Button>
            )}
            onSucces={googleSuccess}
            onFailure={googleFailure}
            cookiePolicy="single_host_origin"
          />
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Button onClick={switchMode}>
                {isSignup ? 'Vous avez déjà un compte. Connectez-vous' : "Je n'ai pas de compte. Inscrivez-vous" }
              </Button>
            </Grid>
          </Grid>

        </form>


      </Paper>
    </Container>
  );
};

export default Auth