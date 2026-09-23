// Importing packages
const {pool} = require('../config/database')

//Create a volley
const createVolley = async(score) => {
    const querynewVolley = 
        `INSERT INTO "Users"(score_arrow) 
        VALUES($1) 
        RETURNING id_arrow, score_arrow`
    const valuesNewVolley = [score]
    const resNewVolley = await pool.query(querynewVolley, valuesNewVolley)

    const newArrow = resNewVolley.rows[0]

    return newArrow
}

// Update a training
const update = async (score, idArrow, idSet, idTraining, idUser) => {
    const queryUpdateArrow = `
        UPDATE "Arrows"
        SET score_arrow = $1,
        WHERE id_arrow = $2 AND fk_id_set = $3 AND fk_id_training = $4 AND fk_id_user = $5
        RETURNING id_arrow, score_arrow, fk_id_set, fk_id_training
        `
    const valuesUpdateArrow = [
        score, 
        idArrow, 
        idSet, 
        idTraining, 
        idUser
    ]

    const resUpdateArrow = await pool.query(queryUpdateArrow, valuesUpdateArrow)

    const updatedArrow = resUpdateArrow.rows[0]

    return updatedArrow
}

// Find volleys
const findAll = async (idTraining, idSet, idUser) => {
    const queryGetArrows = `
        SELECT id_arrow, score_arrow, fk_id_training, fk_id_set, fk_id_user
        FROM "Arrows"
        WHERE fk_id_training= $1 AND fk_id_set = $2 AND fk_id_user = $3
    `
    const valuesGetArrows = [idTraining, idSet, idUser]
    const resGetArrows = await pool.query(queryGetArrows, valuesGetArrows)

    const myArrows = resGetArrows.rows

    return myArrows
}

//Delete a volley
const deleteArrow = async (idTraining, idSet, idArrow, idUser) => {
   const queryDeleteArrow = `
        DELETE FROM "Arrows"
        WHERE fk_id_training = $1 AND fk_id_set = $2 AND id_arrow = $3 AND fk_id_user = $4
    ` 
    const valuesDeleteArrow = [idTraining, idSet, idArrow, idUser]
    const resDeleteArrow = await pool.query(queryDeleteArrow, valuesDeleteArrow)

    const deletedArrow = resDeleteArrow.rows[0] 

    return deletedArrow
}

module.exports = {createVolley, update, findAll, deleteArrow}