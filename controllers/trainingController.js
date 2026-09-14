// Importing packages
const { pool } = require('../config/database')

// Add a new training
const createTraining = async (req, res) => {
    try {
        // Datas recovery
        const {distance, target, place } = req.body

        // Fiels not empty
        if(!distance || !target || !place){
            return res.status(400).json({message: 'Please provide a date, a distance, a target and a place'})
        }

        // Creation
        const queryNewTraining = `INSERT INTO "Trainings"(distance_training, target_training, place_training, fk_id_user)
        VALUES ($1, $2, $3, $4)
        RETURNING id_training, date_training, distance_training, target_training, place_training`
        const valuesNewTraining = [distance, target, place, req.user.id_user]
        const resNewTraining = await pool.query(queryNewTraining, valuesNewTraining)

        const newTraining = resNewTraining.rows[0]

        // Response
        res.status(201).json({
            message: 'New training added',
            newTraining
        })


    } catch (err) {
        res.status(500).json({message: 'Server error during create a train', error:err.message})
    }
}

// Modify a training
const updateTraining = async (req, res) => {
    try {
        // Training exists?
        const queryExistingTraining = 
            `SELECT id_training, date_training, distance_training, target_training, place_training, fk_id_user,
            COUNT(id_training)
            FROM "Trainings"
            WHERE id_training = $1 GROUP BY id_training`
        const valuesExistingTraining = [req.params.idTraining]
        const resExistingTraining = await pool.query(queryExistingTraining, valuesExistingTraining)

        const existingTraining = resExistingTraining.rows[0]

        if(existingTraining.count < 1){
            return res.status(404).json({message:'This training does not exist'})
        }
        
        // Training is mine?
        if(req.user.id_user != existingTraining.fk_id_user){
            return res.status(401).json({message:'You have not authorization'})
        }

        // Datas recovery
        const {distance, target, place} = req.body

        // Values allocation
        if(distance != null){
            existingTraining.distance_training = distance
        }

        if(target != null){
            existingTraining.target_training = target
        }

        if(place != null){
            existingTraining.place_training = place
        }

        // Update request
        const queryUpdateTraining = 
            `UPDATE "Trainings"
            SET distance_training = $1, target_training = $2, place_training = $3
            WHERE id_training = $4 AND fk_id_user = $5
            RETURNING id_training, date_training, distance_training, target_training, place_training
            `
        const valuesUpdateTraining = [
            existingTraining.distance_training, 
            existingTraining.target_training, 
            existingTraining.place_training, 
            req.params.idTraining, 
            req.user.id_user
        ]

        const resUpdateTraining = await pool.query(queryUpdateTraining, valuesUpdateTraining)

        const updatedTraining = resUpdateTraining.rows[0]

        res.status(200).json({
            message: 'Training update successfully',
            updatedTraining
        })

    } catch (err) {
        res.status(500).json({message:'Server error during training modification', error:err.message})
    }
}

// Consult trainings
const getTraining = async (req, res) => {
    try {
        // Trainings are mine?
        const queryGetTrainings = `
            SELECT id_training, date_training, distance_training, place_training, fk_id_user
            FROM "Trainings"
            WHERE fk_id_user = $1
        `
        const valuesGetTrainings = [req.user.id_user]
        const resGetTrainings = await pool.query(queryGetTrainings, valuesGetTrainings)

        const myTrainings = resGetTrainings.rows

        // Response
        if(resGetTrainings.rows[0] != null){
            res.status(200).json({
                message : 'Trainings recovery successfully',
                myTrainings
            })
        } else {
            res.status(200).json({
                message : 'You have not trainings yet'
            })
        }
        

    } catch (err) {
        res.status(500).json({message: "Server error during get trainings", error: err.message})
    }
}

// Delete training
const deleteTraining = async (req, res) => {
    try {
        //Training exists AND is mine ?
        const queryExistingTraining = `
            SELECT id_training, fk_id_user,
            COUNT(id_training)
            FROM "Trainings"
            WHERE id_training = $1 GROUP BY id_training
        `
        const valuesExistingTraining = [req.params.idTraining]
        const resExistingTraining = await pool.query(queryExistingTraining, valuesExistingTraining)

        const existingTraining = resExistingTraining.rows[0]

        // Check if training is found
        if(existingTraining.count < 1){
            return res.status(404).json({message : 'Training is not found'})
        }

        // Check req.user.id_user vs fk_id_user
        if(req.user.id_user != existingTraining.fk_id_user){
            return res.status(401).json({message : 'You have not authorized'})
        }

        //Delete request
        const queryDeleteTraining = `
            DELETE FROM "Trainings"
            WHERE id_training = $1 AND fk_id_user = $2
        ` 
        const valuesDeleteTraining = [req.params.idTraining, req.user.id_user]
        const resDeleteTraining = await pool.query(queryDeleteTraining, valuesDeleteTraining)

        const deletedTraining = resDeleteTraining.rows[0]

        // Response
        res.status(200).json({ 
            message : 'Your training are deleted successfully',
            deletedTraining
        })

    } catch (err) {
        res.status(500).json({message : 'Server error during training deletion', error: err.message})
    }
}

module.exports = {createTraining, updateTraining, getTraining, deleteTraining}