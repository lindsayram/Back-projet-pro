// Importing packages
const {pool} = require('../config/database')

// Email exists?
const isExisting = async (email) => {
    const queryExistingUser = `
        SELECT id_user, pseudo_user, email_user, password_user,
        COUNT(email_user) 
        FROM "Users" 
        WHERE email_user = $1 GROUP BY id_user
    `
    const valuesExistingUser = [email]
    const resExistingUser = await pool.query(queryExistingUser, valuesExistingUser)

    const user = resExistingUser.rows[0]

    return user || null
}

// Create an user
const createUser = async (pseudo, email, hashedPassword) => {
    const querynewUser = 
        `INSERT INTO "Users"(pseudo_user, email_user, password_user) 
        VALUES($1, $2, $3) 
        RETURNING id_user, pseudo_user, email_user`
    const valuesNewUser = [pseudo, email, hashedPassword]
    const resNewUser = await pool.query(querynewUser, valuesNewUser)

    const newUser = resNewUser.rows[0]

    return newUser
}

// Update profile
const updated = async (pseudo, email, hashedPassword, id) => {
    const queryUpdateProfile = `
        UPDATE "Users" 
        SET pseudo_user = $1, email_user = $2, password_user = $3
        WHERE id_user = $4
        RETURNING id_user, pseudo_user, email_user
    `
    const valuesUpdateProfile = [
        pseudo, 
        email, 
        hashedPassword,
        id
    ]
    const resUpdateProfile = await pool.query(queryUpdateProfile, valuesUpdateProfile)

    const updatedProfile = resUpdateProfile.rows[0]

    return updatedProfile
}

module.exports = {isExisting, createUser, updated}