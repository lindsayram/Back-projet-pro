const jwt = require('jsonwebtoken')
const {pool} = require('../config/database')

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
        const queryExistingUser = 
            `SELECT id_user, pseudo_user, email_user, 
            COUNT(id_user) 
            FROM "Users"
            WHERE id_user = $1 GROUP BY id_user`
        const valuesExistingUser = [decoded.id]
        const resExistingUser = await pool.query(queryExistingUser, valuesExistingUser)
        
        // Check if id exists (>=1)
        if(resExistingUser.rows[0].count < 1) {
            return res.status(401).json({message: 'User no longer exists'})
        }

        req.user = resExistingUser.rows[0]

        // Next function
        next()

    } catch (err) {
        return res.status(401).json({message: 'Not authorized, invalid token', error: err.message})
    }
}

module.exports = authMiddleware