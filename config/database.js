const pg = require('pg')
require('dotenv').config()

const { Pool } = pg
 
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

const connectDB = async () => {
  try {
    await pool.query('SELECT NOW()')
    console.log('Database connected')
  } catch (err) {
      console.error('Unable to connect to database :', err)
  }
}

module.exports = {pool, connectDB}