// Importing packaging, functions
const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const { profile, updateProfile } = require('../controllers/userController')

router.get('/profile', authMiddleware, profile)
router.put('/profile', authMiddleware, updateProfile)

module.exports = router