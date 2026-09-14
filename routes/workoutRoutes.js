const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const { createWorkout }= require('../controllers/workoutController')

// Import routes
router.post('/', authMiddleware, createWorkout)

module.exports = router