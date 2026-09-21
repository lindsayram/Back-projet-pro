// Import models and packages
const Set = require('../models/setModels')

// Create a set
const createSet = async (req, res) => {
    try {
        // const
    } catch (err) {
        res.status(500).json({message: 'Server error during ser creation'})
    }
}

module.exports = { createSet, }