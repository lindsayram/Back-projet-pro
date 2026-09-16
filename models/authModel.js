// Importing packages
const {pool} = require('../config/database')

// Email exists?
const isExisting = async (email) => {
    const queryExistingUser = 'SELECT COUNT(email_user) FROM "Users" WHERE email_user = $1'
    const valuesExistingUser = [email]
    const resExistingUser = await pool.query(queryExistingUser, valuesExistingUser)

    const user = resExistingUser.rows[0]

    return user
}

module.exports = {isExisting}