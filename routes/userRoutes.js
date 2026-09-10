// Importing packaging, functions
const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const { profile } = require('../controllers/userController')

router.get('/profile', authMiddleware, profile)

module.exports = router