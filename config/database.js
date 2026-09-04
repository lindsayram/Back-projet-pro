// pool()
//     .then(() => console.log("Connexion à Supabase réussie !"))
//     .catch(err => console.error("Erreur de connexion à MongoDB :", err))


// module.exports = pool.connection

import pg from 'pg'
const { Pool } = pg
require('dotenv').config()

const connectionString = process.env.DATABASE_URL
 
const pool = new Pool({
  connectionString,
})
 
await pool.query('SELECT NOW()')
await pool.end()