// Importing packages
const { pool } = require('../config/database')

// Add a new training
const createWorkout = async (req, res) => {
    try {
        // Datas recovery
        const {distance, target, place } = req.body
        console.log(req.user.id_user)
        // Fiels not empty
        if(!distance || !target || !place){
            return res.status(400).json({message: 'Please provide a date, a distance, a target and a place'})
        }

        // Creation
        const queryNewWorkout = `INSERT INTO "Trainings"(distance_training, target_training, place_training, fk_id_user)
        VALUES ($1, $2, $3, $4)
        RETURNING id_training, date_training, distance_training, target_training, place_training`
        const valuesNewWorkout = [distance, target, place, req.user.id_user]
        const resNewWorkout = await pool.query(queryNewWorkout, valuesNewWorkout)

        const training = resNewWorkout.rows[0]

        // Response
        res.status(201).json({
            message: 'New workout added',
            training
        })


    } catch (err) {
        res.status(500).json({message: 'Server error during create a train', error:err.message})
    }
}

module.exports = {createWorkout}