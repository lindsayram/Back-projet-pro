// Importing models and packages
const { pool } = require('../config/database')

// Create an equipment
const createEquipment = async (name, informations, fk_id_user) => {
    const queryAddEquipment = `
        WITH user_equipment as (
            INSERT INTO "Equipments" (name_equipment, informations_equipment, fk_id_user)
            VALUES($1, $2, $3)
            RETURNING id_equipment, name_equipment, informations_equipment, fk_id_user
        ) SELECT id_equipment, name_equipment, informations_equipment, id_user, pseudo_user FROM user_equipment
            INNER JOIN "Users" ON fk_id_user = id_user
        `
        const valuesAddEquipment = [name, informations, fk_id_user]
        const resAddEquipment = await pool.query(queryAddEquipment, valuesAddEquipment)

        const newEquipment = resAddEquipment.rows[0]

        return newEquipment
}

// Find an equipment
const findEquipment = async (idEquipment) => {
    const queryExistingEquipment = `
        SELECT id_equipment, fk_id_user,
        COUNT(id_equipment)
        FROM "Equipments"
        WHERE id_equipment = $1 GROUP BY id_equipment
    `
    const valuesExistingEquipment = [idEquipment]
    const resExistingEquipment = await pool.query(queryExistingEquipment, valuesExistingEquipment)

    const existingEquipment = resExistingEquipment.rows[0]
    
    return existingEquipment
}

// Update an equipment
const updated = async (name, informations, idEquipment, idUser) => {
    const queryUpdatedEquipment = `
        UPDATE "Equipments"
        SET name_equipment = $1, informations_equipment = $2
        WHERE id_equipment = $3 AND fk_id_user = $4
        RETURNING *
    `
    const valuesUpdatedEquipment = [name, informations, idEquipment, idUser]
    const resUpdatedEquipment = await pool.query(queryUpdatedEquipment, valuesUpdatedEquipment)

    const updatedEquipment = resUpdatedEquipment.rows[0]

    return updatedEquipment
}

// Display Equipments
const display = async (idUser) => {
    const queryGetEquipment = `
        SELECT name_equipment, informations_equipment
        FROM "Equipments"
        WHERE fk_id_user = $1    
    ` 
    const valuesGetEquipment = [idUser]
    const resGetEquipment = await pool.query(queryGetEquipment, valuesGetEquipment)

    const myEquipments = resGetEquipment.rows
    console.log(idUser)
    return myEquipments
}

// Delete Equipment
const deleteEquipment = async (idEquipment, idUser) => {
    const queryDeletedEquipment = `
            DELETE FROM "Equipments"
            WHERE id_equipment = $1 AND fk_id_user = $2
        `
        const valuesDeletedEquipment = [idEquipment, idUser]
        const resDeletedEquipment = await pool.query(queryDeletedEquipment, valuesDeletedEquipment)

        const deletedEquipment = resDeletedEquipment.rows[0]

        return deletedEquipment
}

module.exports = {createEquipment, findEquipment, updated, display, deleteEquipment}

    