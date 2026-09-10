// Importing packages
const { pool } = require('../config/database')

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

module.exports = {profile}