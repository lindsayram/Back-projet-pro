const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET

const authMiddleware = async (req, res) => {
    try {
        let token
        // Take the first part
        if(req.headers.authorization?.startWith('Bearer')){
            token = req.headers.authorization.split(' ')[1]
        }

        // Token is true?
        if(!token){
            return res.status(401).json({message: 'Not authorized, token missing'})
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET)

        // Get user from token payload
        // Miss register...
    } catch (err) {
        return res.status(401).json({message: 'Not authorized, invalid token', error: err.message})
    }
}

module.exports = authMiddleware