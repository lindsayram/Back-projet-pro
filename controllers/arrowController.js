// Importing ressources
const { pool } = require('../config/database')
const Arrow = require('../models/arrowModel')
const Training = require('../models/trainingModels')
const Set = require('../models/setModels')
const { json } = require('express')

//Create a volley
const addArrow = async (req, res) => {
    try {
        // Training exists?
        const isExistingTraining = await Training.findOne(req.params.idTraining)

        if(!isExistingTraining) {
            res.status(404).json({message: 'This training does not exist'})
        }

        // Set exists ?
        const isExistingSet = await Set.findOne(req.params.idSet)

        if(!isExistingSet) {
            res.status(404).json({message: 'This set does not exist'})
        }

        // Datas revory
        const {score} = req.body

        // Fields not empty
        if(!score){
            return res.status(400).json({message: 'Please provide a score'})
        }

        // Add 
        const newArrow = await Arrow.createVolley(score)

        // Response
        res.status(201).json({
            message: 'A new arrow successfully added',
            newArrow
        })

    } catch (err) {
        res.status(500).json({message : "Server error during add a new arrow", error: err.message})
    }
}

//Update a volley
const updateArrow = async (req, res) => {
    try {
        // Training exists?
        const isExistingTraining = await Training.findOne(req.params.idTraining)

        if(!isExistingTraining){
            return res.status(404).json({message:'This training does not exist'})
        }

        // Training is mine?
        if(req.user.id_user != isExistingTraining.fk_id_user){
            return res.status(401).json({message:'You have not authorization'})
        }

        // Set exists ?
        const isExistingSet = await Set.findOne(req.params.idSet)

        if(!isExistingSet) {
            res.status(404).json({message: 'This set does not exist'})
        }

        // Set is mine?
        if(req.user.id_user != isExistingSet.fk_id_user){
            return res.status(401).json({message:'You have not authorization'})
        }

        // Arrow exists ?
        const isExistingArrow = await Set.findOne(req.params.idArrow)

        if(!isExistingArrow) {
            res.status(404).json({message: 'This arrow does not exist'})
        }

        // Arrow is mine?
        if(req.user.id_user != isExistingArrow.fk_id_user){
            return res.status(401).json({message:'You have not authorization'})
        }

        // Datas recovery
        const {score} = req.body

        // Values allocation
        if(score != null){
            isExistingArrow.score_arrow = score
        }

        // Update request
        const updatedArrow = await Arrow.update(score, req.params.idArrow, req.params.idSet, req.params.idTraining, req.user.id_user)

        res.status(200).json({
            message: 'Arrow update successfully',
            updatedArrow
        })

    } catch (err) {
        res.status(500).json({message:'Server error during arrow modification', error:err.message})
    }
}

// Display volley's set
const getVolley = async (req, res) => {
    try {
        // Training exists?
        const isExistingTraining = await Training.findOne(req.params.idTraining)

        if(!isExistingTraining){
            return res.status(404).json({message:'This training does not exist'})
        }

        // Training is mine?
        if(req.user.id_user != isExistingTraining.fk_id_user){
            return res.status(401).json({message:'You have not authorization'})
        }

        // Set exists ?
        const isExistingSet = await Set.findOne(req.params.idSet)

        if(!isExistingSet) {
            res.status(404).json({message: 'This set does not exist'})
        }

        // Set is mine?
        if(req.user.id_user != isExistingSet.fk_id_user){
            return res.status(401).json({message:'You have not authorization'})
        }

        const myArrows = await Arrow.findAll(req.params.idTraining, req.params.idSet, req.user.id_user)

        // Response
        res.status(200).json({
            message: 'Arrows successfully recovery',
            myArrows
        })
    } catch (err) {
        res.status(500).json({ message : 'Server error during get Volleys'})
    }
    
}

// Delete a volley
const deleteVolley = async (req, res) => {
    try {
        //Training exists AND is mine ?
         const isExistingTraining = await Training.findOne(req.params.idTraining)

        if(!isExistingTraining){
            return res.status(404).json({message:'This training does not exist'})
        }

        // Check req.user.id_user vs fk_id_user
        if(req.user.id_user != isExistingTraining.fk_id_user){
            return res.status(401).json({message : 'You have not authorized'})
        }

        // Set exists ?
        const isExistingSet = await Set.findOne(req.params.idSet)

        if(!isExistingSet) {
            res.status(404).json({message: 'This set does not exist'})
        }

        // Set is mine?
        if(req.user.id_user != isExistingSet.fk_id_user){
            return res.status(401).json({message:'You have not authorization'})
        }

        // Arrow exists ?
        const isExistingArrow = await Set.findOne(req.params.idArrow)

        if(!isExistingArrow) {
            res.status(404).json({message: 'This arrow does not exist'})
        }

        // Arrow is mine?
        if(req.user.id_user != isExistingArrow.fk_id_user){
            return res.status(401).json({message:'You have not authorization'})
        }

        //Delete request
        await Training.deleteTraining(req.params.idTraining, req.params.idSet, req.params.idArrow, req.user.id_user)

        // Response
        res.status(200).json({message : 'Your volley is deleted successfully'})

    } catch (err) {
        res.status(500).json({message : 'Server error during volley deletion', error: err.message})
    }
}

module.exports = { addArrow, updateArrow, getVolley, deleteVolley}