const { test, describe, before, after} = require('node:test')
const assert = require('node:assert')

const {profile, updateProfile} = require('../controllers/userController')
const {pool} = require('../config/database')

// Helper mock response
const createMockRes = () => {
    const res = {
        statusCode: 200,
        body: null,
        status(code){
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

describe('US3: User\'s profile', () => {
    const userA = {
        id: 2 
    }

    before(async () => {
        await pool.query('DELETE FROM "Users" WHERE id_user= $1', [userA.id])

    })

    after(async () => {
        await pool.query('DELETE FROM "Users" WHERE id_user= $1', [userA.id])
    })

    test('US3.1: User can consult his profile ', async ()=> {
        const req = {}
        const res = createMockRes()
        await profile(req, res)
        assert.strictEqual(res.statusCode, 200)
    })
})