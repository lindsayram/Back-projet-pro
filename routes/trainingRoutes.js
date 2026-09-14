const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const { createTraining, updateTraining, getTraining, deleteTraining }= require('../controllers/trainingController')

// Import routes
router.post('/', authMiddleware, createTraining)
router.get('/', authMiddleware, getTraining)
router.put('/:idTraining', authMiddleware, updateTraining)
router.delete('/:idTraining', authMiddleware, deleteTraining)

module.exports = router