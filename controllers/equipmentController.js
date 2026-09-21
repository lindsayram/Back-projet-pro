// Importing ressources
const { pool } = require('../config/database')
const Equipment = require('../models/equipmentModel')

const addEquipment = async (req, res) => {
    try {
        // Datas revory
        const {name, informations} = req.body

        // Fields not empty
        if(!name){
            return res.status(400).json({message: 'Please provide a name'})
        }

        // Add 
        const newEquipment = await Equipment.createEquipment(name, informations, req.user.id_user)

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
        const isExistingEquipment = await Equipment.findEquipment(req.params.idEquipment)

        
        if(!isExistingEquipment.count){
            return res.status(404).json({message: 'Equipment not found'})
        }
        
        // Equipment is mine?
        if(isExistingEquipment.fk_id_user != req.user.id_user){
            return res.status(401).json({message: 'You are not authorized'})
        }

        // Datas recovery
        const {name, informations} = req.body

        if(name != null){
            isExistingEquipment.name_equipment = name
        }

        if(informations != null){
            isExistingEquipment.informations_equipment = informations
        }

        // Update (request)
        const updatedEquipment = await Equipment.updated(name, informations, req.params.idEquipment, req.user.id_user)

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
        const myEquipments = await Equipment.display(req.user.id_user)

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
        const isExistingEquipment = await Equipment.findEquipment(req.params.idEquipment)

        if(!isExistingEquipment){
            return res.status(404).json({message: 'Equipment not found'})
        }
        
        // Equipment is mine?
        if(isExistingEquipment.fk_id_user != req.user.id_user){
            return res.status(401).json({message: 'You are not authorized'})
        }

        // Delete(request)
        await Equipment.deleteEquipment(req.params.idEquipment, req.user.id_user)

        // Response
        res.status(200).json({message: 'Equipment was deleted successfully'})
        
    } catch (err) {
        res.status(500).json({message: 'Server error during equipment deletion', error: err.message})
    }
}

module.exports = {addEquipment, updateEquipment, getEquipment, deleteEquipment}
