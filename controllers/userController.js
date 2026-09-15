// Importing packages
const { pool } = require('../config/database')
const bcrypt = require('bcryptjs')
const validator = require('validator')

// Consult profile
const profile = async (req, res) => {
    try {
        // ID recovery in URL
        // const { id } = req.params

        // // id is associated to user, informations recovery
        // const queryExistingUser = 
        //     `SELECT id_user, pseudo_user, email_user
        //     COUNT(id_user) 
        //     FROM "Users" 
        //     WHERE id_user: $1 GROUP BY id_user`
        // const valuesExistingUser = [id]
        // const resExistingUser = (queryExistingUser, valuesExistingUser)

        // // Search user
        // const user = resExistingUser[0]
        // if(user.count < 1){
        //     return res.status(400).json({message:'User not found'})
        // }

        res.status(200).json({user: req.user})
    } catch (err) {
        res.status(500).json({message:'Server error fetching user profile', error: err.message})
    }
}

// Update profile
const updateProfile = async (req, res) => {
    try {
        // User exists? (request preparation)
        const queryExistingUser = 
            `SELECT id_user, pseudo_user, email_user, password_user,
            COUNT(id_user)
            FROM "Users"
            WHERE id_user = $1 GROUP BY id_user`
        const valuesExistingUser = [req.user.id_user]
        const resExistingUser = await pool.query(queryExistingUser, valuesExistingUser)

        const user = resExistingUser.rows[0]

        // User exists?
        if(!user){
            return res.status(404).json({message: 'User not found'})
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
        
        const queryUpdateProfile = 
        `UPDATE "Users" 
        SET pseudo_user = $1, email_user = $2, password_user = $3
        WHERE id_user = $4
        RETURNING id_user, pseudo_user, email_user
        `
        const valuesUpdateProfile = [
            req.user.pseudo_user, 
            req.user.email_user, 
            req.user.password_user, 
            req.user.id_user
        ]
        const resUpdateProfile = await pool.query(queryUpdateProfile, valuesUpdateProfile)

        const updatedProfile = resUpdateProfile.rows[0]
        
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