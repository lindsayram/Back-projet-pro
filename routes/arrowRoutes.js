// Importing packages and functions
const express = require('express')
const router = express.Router()
const {addArrow, updateArrow, getVolley, deleteVolley} = require('../controllers/arrowController')
const authMiddleware = require('../middleware/authMiddleware')


//Importing routes
router.post('/idTraining/idSet', authMiddleware, addArrow)
router.get('/idTraining/idSet', authMiddleware, getVolley)
router.put('/idTraining/idSet/idArrow', authMiddleware, updateArrow)
router.delete('/idTraining/idSet/idArrow', authMiddleware, deleteVolley)
