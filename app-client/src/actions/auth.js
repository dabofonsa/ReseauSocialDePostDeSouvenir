import { AUTH } from '../constants/actionTypes';
import * as api from '../api/index.js';

export const signin = (formData, navigate, router) => async (dispatch) => {
  try {
     //connexion de l'utilisateur
    const { data } = await api.signIn(formData);
    dispatch({ type: AUTH, data });
     navigate("/");
  } catch (error) {
    console.log(error);
    
  }
}


export const signup = (formData, navigate, router) => async (dispatch) => {
  try {
    //inscription de l'utilisateur
    const { data } = await api.signUp(formData);
    dispatch({ type: AUTH, data });
     navigate("/");
  } catch (error) {
    console.log(error);
    
  }
}


