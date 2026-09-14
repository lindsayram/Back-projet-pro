const { test, describe, before, after } = require('node:test')
const assert = require('node:assert')

const {register, login} = require('../controllers/authController')

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

describe('Unities tests to authorization'), () => {
    let userA, userB, tokenA, tokenB

    before(async () => {
        
    })
}