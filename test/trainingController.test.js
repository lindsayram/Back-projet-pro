const { test, describe, before, after } = require('node:test')
const assert = require('node:assert')

const {register, login} = require('../controllers/authController')
const {pool} = require('../config/database')
const { createTraining } = require('../controllers/trainingController')

// Helper mock response
const createMockRes = () => {
    const res = {
        statusCode: 200,
        body: null,
        status(code) {
            this.statusCode = code
            return this
        },
        json(data) {
            this.body = data
            return this
        }
    }
    return res
}

describe('US6: Create a new training with a distance, a target and a place', () => {
    const userA = {
        pseudo:'Alice',
        email: 'test_us_newtraining@example.com',
        password: 'Password123!'
    }
    let resRegister

    // Clean at the beginning
    before(async () =>{
        await pool.query('DELETE FROM "Users" WHERE email_user = $1', [userA.email])

        resRegister = createMockRes()
        await register (
            {body: userA},
            resRegister
        )

        const resLogin = createMockRes()
        await login(
            {body:{
                email: userA.email,
                password: userA.password
            }},
            resLogin
        )
        await pool.query('DELETE FROM "Trainings" WHERE fk_id_user = $1', [resRegister.body.newUser.id_user])
    })

    // Clean at the ending
    after(async () =>{
        await pool.query('DELETE FROM "Users" WHERE email_user = $1', [userA.email])
        await pool.query('DELETE FROM "Trainings" WHERE fk_id_user = $1', [resRegister.body.newUser.id_user])
    })

    test('US6.1: Create a new training is ok', async () =>{
        const reqCreate = {
            body:{
                distance : "18 m",
                target : "WA",
                place : "outside"
            },
            user:{
                id_user : resRegister.body.newUser.id_user
            }
        }
        const resCreate = createMockRes()
        await createTraining(reqCreate, resCreate)
        console.log(resCreate)
        assert.strictEqual(resCreate.statusCode, 201)
        newTraining = resCreate.body
    })
})