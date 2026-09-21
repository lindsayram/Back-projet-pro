// Import database connection
const { pool } = require('../config/database')

// Create a training
const create = async (distance, target, place, idUser) => {
    const queryNewTraining = `
        INSERT INTO "Trainings"(distance_training, target_training, place_training, fk_id_user)
        VALUES ($1, $2, $3, $4)
        RETURNING id_training, date_training, distance_training, target_training, place_training`
    const valuesNewTraining = [distance, target, place, idUser]
    const resNewTraining = await pool.query(queryNewTraining, valuesNewTraining)

    const newTraining = resNewTraining.rows[0]

    return newTraining
}

// Update a training
const update = async (distance, target, place, idTraining, idUser) => {
    const queryUpdateTraining = `
        UPDATE "Trainings"
        SET distance_training = $1, target_training = $2, place_training = $3
        WHERE id_training = $4 AND fk_id_user = $5
        RETURNING id_training, date_training, distance_training, target_training, place_training
        `
    const valuesUpdateTraining = [
        distance, 
        target, 
        place, 
        idTraining, 
        idUser
    ]

    const resUpdateTraining = await pool.query(queryUpdateTraining, valuesUpdateTraining)

    const updatedTraining = resUpdateTraining.rows[0]

    return updatedTraining
}

// Display trainings
const display = async (idUser) => {
    const queryGetTrainings = `
        SELECT id_training, date_training, distance_training, place_training, fk_id_user
        FROM "Trainings"
        WHERE fk_id_user = $1
    `
    const valuesGetTrainings = [idUser]
    const resGetTrainings = await pool.query(queryGetTrainings, valuesGetTrainings)

    const myTrainings = resGetTrainings.rows

    return myTrainings
}

// Delete trainings
const deleteTraining = async (idTraining, idUser) => {
   const queryDeleteTraining = `
        DELETE FROM "Trainings"
        WHERE id_training = $1 AND fk_id_user = $2
    ` 
    const valuesDeleteTraining = [idTraining, idUser]
    const resDeleteTraining = await pool.query(queryDeleteTraining, valuesDeleteTraining)

    const deletedTraining = resDeleteTraining.rows[0] 

    return deletedTraining
}

// Find a Training
const findOne = async (idTraining) => {
    const queryExistingTraining = `
        SELECT id_training, date_training, distance_training, target_training, place_training, fk_id_user,
        COUNT(id_training)
        FROM "Trainings"
        WHERE id_training = $1 GROUP BY id_training
    `
    const valuesExistingTraining = [idTraining]
    const resExistingTraining = await pool.query(queryExistingTraining, valuesExistingTraining)

    const existingTraining = resExistingTraining.rows[0]
    
    return existingTraining || null    
}

module.exports = {create, update, findOne, display, deleteTraining}