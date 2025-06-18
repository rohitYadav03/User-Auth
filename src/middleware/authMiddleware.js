const jwt = require("jsonwebtoken");

// Middleware = verifies token + attaches minimal identity info (not full data)
// Route = decides what to do with that identity (fetch DB, etc.)

const authMiddleware = (req,res,next) => {
    // check for the token if it exist or not 
    try {
   const token = req.cookies["access-token"];

    if(!token){
      return  res.status(400).json({message : "Unauthorized. Please login again"})
    }
    // now if the token is valid then we need to veriy it is correct or not
const decoded  = jwt.verify(token, "Mysecreatcodeis18");
console.log(decoded);

req.user = decoded;
next();
// if the token is empty then send that id 
} catch (error) {
        res.status(400).json({ message: `Token error: ${error.message}` })
}
}

module.exports = {authMiddleware}