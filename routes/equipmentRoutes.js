// Importing packages
const express = require('express')
const router = express.Router()
const { addEquipment, updateEquipment, getEquipment, deleteEquipment } = require('../controllers/equipmentController')
const authMiddleware = require('../middleware/authMiddleware')

// Importing routes
router.post('/', authMiddleware, addEquipment)
router.get('/', authMiddleware, getEquipment)
router.put('/update/:idEquipment', authMiddleware, updateEquipment)
router.delete('/deletion/:idEquipment', authMiddleware, deleteEquipment)

module.exports = router