// Importing packages and models
const Training = require('../models/trainingModels')

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
        const newTraining = await Training.create(distance, target, place, req.user.id_user)

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
        const isExistingTraining = await Training.findOne(req.params.idTraining)

        if(isExistingTraining.count < 1){
            return res.status(404).json({message:'This training does not exist'})
        }
        
        // Training is mine?
        if(req.user.id_user != isExistingTraining.fk_id_user){
            return res.status(401).json({message:'You have not authorization'})
        }

        // Datas recovery
        const {distance, target, place} = req.body

        // Values allocation
        if(distance != null){
            isExistingTraining.distance_training = distance
        }

        if(target != null){
            isExistingTraining.target_training = target
        }

        if(place != null){
            isExistingTraining.place_training = place
        }

        // Update request
        const updatedTraining = await Training.update(distance, target, place, req.params.idTraining, req.user.id_user)

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
       const myTrainings = await Training.display(req.user.id_user)

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
         const isExistingTraining = await Training.findOne(req.params.idTraining)

        if(!isExistingTraining){
            return res.status(404).json({message:'This training does not exist'})
        }

        // Check req.user.id_user vs fk_id_user
        if(req.user.id_user != isExistingTraining.fk_id_user){
            return res.status(401).json({message : 'You have not authorized'})
        }

        //Delete request
        await Training.deleteTraining(req.params.idTraining, req.user.id_user)

        // Response
        res.status(200).json({message : 'Your training are deleted successfully'})

    } catch (err) {
        res.status(500).json({message : 'Server error during training deletion', error: err.message})
    }
}

module.exports = {createTraining, updateTraining, getTraining, deleteTraining}