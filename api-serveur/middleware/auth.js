import jwt from 'jsonwebtoken';

const secret = "test";

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length < 500;

    let decodedData;

    if(token && isCustomAuth){
      decodedData = jwt.verify(token, secret);

      req.userId = decodedData?.id;
    }else{
      decodedData = jwt.decode(token);

      //sub: permet d'attribuer un id specifique à chaque user de google
      req.userId = decodedData?.sub;
    }

    
    next();
  } catch (error) {
    console.log(error)
  }
}

export default auth;