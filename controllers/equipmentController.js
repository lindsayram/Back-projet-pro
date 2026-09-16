// Importing ressources
const { pool } = require('../config/database')

const addEquipment = async (req, res) => {
    try {
        // Datas revory
        const {name, informations} = req.body

        // Fields not empty
        if(!name){
            return res.status(400).json({message: 'Please provide a name'})
        }

        // Add 
        const queryAddEquipment = `
            WITH user_equipment as (
                INSERT INTO "Equipments" (name_equipment, informations_equipment, fk_id_user)
                VALUES($1, $2, $3)
                RETURNING id_equipment, name_equipment, informations_equipment, fk_id_user
            ) SELECT id_equipment, name_equipment, informations_equipment, id_user, pseudo_user FROM user_equipment
                INNER JOIN "Users" ON fk_id_user = id_user
        `
        const valuesAddEquipment = [name, informations, req.user.id_user]
        const resAddEquipment = await pool.query(queryAddEquipment, valuesAddEquipment)

        const newEquipment = resAddEquipment.rows[0]

        // Response
        res.status(201).json({
            message: 'A new equipment successfully added',
            newEquipment
        })

    } catch (err) {
        res.status(500).json({message : "Server error during add a new equipment", error: err.message})
    }
}

const updateEquipment = async(req, res) => {
    try {
        // Equipment exists?
        const queryExistingEquipment = `
            SELECT id_equipment, fk_id_user,
            COUNT(id_equipment)
            FROM "Equipments"
            WHERE id_equipment = $1 GROUP BY id_equipment
        `
        const valuesExistingEquipment = [req.params.idEquipment]
        const resExistingEquipment = await pool.query(queryExistingEquipment, valuesExistingEquipment)

        const existingEquipment = resExistingEquipment.rows[0]

        if(!existingEquipment){
            return res.status(404).json({message: 'Equipment not found'})
        }
        
        // Equipment is mine?
        if(existingEquipment.fk_id_user != req.user.id_user){
            return res.status(401).json({message: 'You are not authorized'})
        }

        // Datas recovery
        const {name, informations} = req.body

        if(name != null){
            existingEquipment.name_equipment = name
        }

        if(informations != null){
            existingEquipment.informations_equipment = informations
        }

        // Update (request)
        const queryUpdatedEquipment = `
            UPDATE "Equipments"
            SET name_equipment = $1, informations_equipment = $2
            WHERE id_equipment = $3 AND fk_id_user = $4
            RETURNING *
        `
        const valuesUpdatedEquipment = [name, informations, req.params.idEquipment, req.user.id_user]
        const resUpdatedEquipment = await pool.query(queryUpdatedEquipment, valuesUpdatedEquipment)

        const updatedEquipment = resUpdatedEquipment.rows[0]

        // Response
        res.status(200).json({
            message: 'You have updated your equipment successfully',
            updatedEquipment:{
                name_equipment : updatedEquipment.name_equipment,
                informations_equipment : updatedEquipment.informations_equipment
            }
        })

    } catch (err) {
        res.status(500).json({message: 'Server error during equipment update', error: err.message})
    }
}

const getEquipment = async(req, res) => {
    try {
        //get (request)
        const queryGetEquipment = `
            SELECT name_equipment, informations_equipment
            FROM "Equipments"
            WHERE fk_id_user = $1    
        ` 
        const valuesGetEquipment = [req.user.id_user]
        const resGetEquipment = await pool.query(queryGetEquipment, valuesGetEquipment)

        const myEquipments = resGetEquipment.rows

        // Response
        res.status(200).json({
            message: 'Your equipment:',
            myEquipments
        })  
    } catch (err) {
        res.status(500).json({message: 'Server error during get equipments', error: err.message})
    }
}

const deleteEquipment = async(req,res) => {
    try {
        // Equipment exists?
        const queryExistingEquipment = `
            SELECT id_equipment, fk_id_user,
            COUNT(id_equipment)
            FROM "Equipments"
            WHERE id_equipment = $1 GROUP BY id_equipment
        `
        const valuesExistingEquipment = [req.params.idEquipment]
        const resExistingEquipment = await pool.query(queryExistingEquipment, valuesExistingEquipment)

        const existingEquipment = resExistingEquipment.rows[0]

        if(!existingEquipment){
            return res.status(404).json({message: 'Equipment not found'})
        }
        
        // Equipment is mine?
        if(existingEquipment.fk_id_user != req.user.id_user){
            return res.status(401).json({message: 'You are not authorized'})
        }

        // Delete(request)
        const queryDeletedEquipment = `
            DELETE FROM "Equipments"
            WHERE id_equipment = $1 AND fk_id_user = $2
        `
        const valuesDeletedEquipment = [req.params.idEquipment, req.user.id_user]
        const resDeletedEquipment = await pool.query(queryDeletedEquipment, valuesDeletedEquipment)

        const deletedEquipment = resDeletedEquipment.rows[0]

        // Response
        res.status(200).json({message: 'Equipment was deleted successfully'})
        
    } catch (err) {
        res.status(500).json({message: 'Server error during equipment deletion', error: err.message})
    }
}

module.exports = {addEquipment, updateEquipment, getEquipment, deleteEquipment}
