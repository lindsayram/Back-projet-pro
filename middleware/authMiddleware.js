const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const JWT_SECRET = process.env.JWT_SECRET

const authMiddleware = async (req, res, next) => {
    try {
        let token

        // Take the first part
        if(req.headers.authorization?.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1]
        }

        // Token is true?
        if(!token){
            return res.status(401).json({message: 'Not authorized, token missing'})
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET)

        // Get user from token payload
        const isExisitingUser = await User.findById(decoded.id)

        // Check if id exists
        if(!isExisitingUser) {
            return res.status(401).json({message: 'User no longer exists'})
        }

        req.user = isExisitingUser

        // Next function
        next()

    } catch (err) {
        return res.status(401).json({message: 'Not authorized, invalid token', error: err.message})
    }
}

module.exports = authMiddleware