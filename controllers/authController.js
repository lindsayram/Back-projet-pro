// Import packages
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const {pool} = require('../config/database')

const JWT_SECRET = process.env.JWT_SECRET

// Expiration time
const JWT_EXPIRES_IN = '364d'

// Helper to generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET,  {
        expiresIn: JWT_EXPIRES_IN
    })
}

const register = async (req, res) => {
    try {
        // Datas recovery
        const { pseudo, email, password} = req.body

        // Fields not empty
        if(!pseudo || !email || !password) {
            return res.status(400).json({message:'Please provide pseudo, email and password'})
        }

        // Verify password structure
        const isPasswordOk = validator.isStrongPassword(password, {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })

        // Password has the structure valid
        if(!isPasswordOk){
            return res.status(400).json({message:'Password must have 1 lower, 1 upper, 1 number and 1 symbol and must be at least 6 characters long'})
        }

        // Verify email structure
        const isEmailOk = validator.isEmail(email)

        // Email has structure valid
        if(!isEmailOk) {
            return res.status(400).json({message : " You must provide a valid email"})
        }

        // Check if user already exists (1.query preparation)
        const queryExistingUser = 'SELECT COUNT(email_user) FROM "Users" WHERE email_user = $1'
        const valuesExistingUser = [email]
        const resExistingUser = await pool.query(queryExistingUser, valuesExistingUser)

        // Check if user already exists (2.search in table)
        if (resExistingUser.rows[0].count >= 1){
            return res.status(400).json({message: "Email is alredy used"})
        }

        // Hash password
        const hash = await bcrypt.hash(password, 10)

        // Register user
        const querynewUser = 
            'INSERT INTO "Users"(pseudo_user, email_user, password_user) VALUES($1, $2, $3) RETURNING id_user, pseudo_user, email_user'
        const valuesNewUser = [pseudo, email, hash]
        const resNewUser = await pool.query(querynewUser, valuesNewUser)

        const user = resNewUser.rows[0]

        // Generate token
        const token = generateToken(user.id_user)

        // Display response
        res.status(201).json({
            message: 'User create successfully',
            token,
            user
        })

    } catch (err) {
        return res.status(500).json({message: 'Server error during registration', error: err.message })
    }
}

const login = async (req, res) => {
    try {
        // Datas recovery
        const {email, password} = req.body

        // Fields not empty
        if(!email || !password){
            return res.status(400).json({message: 'Please provide email and password'})
        }

        // Find user 
        const queryExisitingUser = 'SELECT id_user, pseudo_user, email_user, password_user, COUNT(email_user) FROM "Users" WHERE email_user = $1 GROUP BY id_user'
        const valuesExisitingUser = [email]
        const resExisitingUser = await pool.query(queryExisitingUser, valuesExisitingUser)

        const user = resExisitingUser.rows[0]

        // Search if user existing
        if (user.count < 1){
            return res.status(401).json ({message:  'Invalid credentials'})
        }
        
        // Compare password: DB vs body
        const isMatch = await bcrypt.compare(password, user.password_user)

        // Not matched
        if(!isMatch){
            return res.status(401).json ({message: 'Invalid credentials'})
        }

        // Generate token
        const token = generateToken(user.id_user)

        // Display response
        res.status(200).json ({
            message: 'Login successful',
            token,
            user
        })

    } catch (err) {
        res.status(500).json({message: 'Server error during login', error: err.message})
    }
}
module.exports = {register, login}