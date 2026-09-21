// Importing packages
const { pool } = require('../config/database')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const User = require('../models/userModel')


// Consult profile
const profile = async (req, res) => {
    try {
        res.status(200).json({user: req.user})
    } catch (err) {
        res.status(500).json({message:'Server error fetching user profile', error: err.message})
    }
}

// Update profile
const updateProfile = async (req, res) => {
    try {
        // User exists? (request preparation)
        const isExistingUser = await User.isExisting (req.user.email_user)
        

        if (!isExistingUser.count){
            return res.status(400).json({message: "Email is alredy used"})
        }
        
        // Datas recovery
        const {pseudo, email, password} = req.body
        
        // Values allocation
        if(pseudo != null){
            req.user.pseudo_user = pseudo
        }
        
        if(email != null){
            const isEmailOk = validator.isEmail(email)

            // Email has structure valid
            if(!isEmailOk) {
                return res.status(400).json({message : " You must provide a valid email"})
            }
            
            req.user.email_user = email
        }
        
        if(password != null){
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
            
            // Hash password
            const hash = await bcrypt.hash(password, 10)
            req.user.password_user = hash
            
        }

        const updatedProfile = await User.updated(req.user.pseudo_user, req.user.email_user, req.user.password_user, req.user.id_user)
        
        res.status(200).json({
            message: "Profil update successfully",
            user:{
                id_user: updatedProfile.id_user,
                pseudo_user: updatedProfile.pseudo_user,
                email_user: updatedProfile.email_user
            }
        })

    } catch (err) {
        res.status(500).json({message:'Server error', error: err.message})
    }
}

module.exports = {profile, updateProfile}