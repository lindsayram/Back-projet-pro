const { test, describe, before, after } = require('node:test')
const assert = require('node:assert')

const {register, login} = require('../controllers/authController')
const {pool} = require('../config/database')

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

describe('US1: User registration '), () => {
    let userA, userB
    const testEmails = ['test_us_a@example.com', 'test_us_b@example.com']

    // Clean before test
    before(async () => {
        await pool.query('DELETE FROM "Users" WHERE email_user ANY ($1)', [testEmails])
    })

    after(async () => {
        await pool.query('DELETE FROM "Users" WHERE email_user ANY ($1)', [testEmails])
        await pool.end()
    })

    // No registered --> register ok
    test('US1.1: Register user with email, pseudo, strong password', async () => {
        // Register user A
        const reqA = {
            body: {
                pseudo:'Alice',
                email: 'test_us_a@example.com',
                password: 'Password123!'
            }
        }

        const resA = createMockRes()
        await register(reqA, resA)
        assert.strictEqual(resA.statusCode, 201)
        assert.ok(resA.body.token)
        userA = resA.body.user

        // Register user B
        const reqB = {
            body: {
                pseudo:'Bob',
                email: 'test_us_b@example.com',
                password: 'Password123!'
            }
        }

        const resB = createMockRes()
        await register(reqB, resB)
        assert.strictEqual(resB.statusCode, 201)
        assert.ok(resB.body.token)
        userB = resB.body.user
    })

    // Using an already registered email
    test('US1.2: Register rejects an already registered email ', async () => {
        // Register user A
        const reqA = {
            body: {
                pseudo:'Alice',
                email: 'test_us_a@example.com',
                password: 'Password123!'
            }
        }

        const resA = createMockRes()
        await register(reqA, resA)
        assert.strictEqual(resA.statusCode, 201)
        assert.ok(resA.body.token)
        userA = resA.body.user

        // Email duplicated
        const resDup = createMockRes()
        await register(reqA, resDup)
        assert.strictEqual(resDup.statusCode, 400)
    })

    // Non-compliant password
    test('US1.3: Register rejects weak password', async () => {
        // Register user A
        const reqA = {
            body: {
                pseudo:'Alice',
                email: 'test_us_a@example.com',
                password: 'Password12'
            }
        }

        const resA = createMockRes()
        await register(reqA, resA)
        assert.strictEqual(resA.statusCode, 400)
    })

    // Non-compliant email
    test('US1.4: Register rejects non-compliant email', async () => {
        // Register user A
        const reqA = {
            body: {
                pseudo:'Alice',
                email: 'test_us_a',
                password: 'Password12'
            }
        }

        const resA = createMockRes()
        await register(reqA, resA)
        assert.strictEqual(resA.statusCode, 400)
    })

    // Fields are empty
    test('US1.5: Register rejects empty fields', async () => {
        // Register user A
        const reqA = {
            body: {
                pseudo:'Alice',
                email: 'test_us_a@example.com',
                password: ''
            }
        }

        const resA = createMockRes()
        await register(reqA, resA)
        assert.strictEqual(resA.statusCode, 400)
    })
}

describe('US2: User login'), () => {
    test('US2.1: Login user with valid credentials', async() => {
        // Login user A
        const reqA = {
            body: {
                email: 'test_us_a@example.com',
                password: "Password1234!"
            }
        }
        const resA = createMockRes()
        await login(reqA, resA)
        assert.strictEqual(resA.statusCode, 200)
        assert.ok(resA.body.token)
        tokenA = resA.body.token

        // Login user B
        const reqB = {
            body: {
                email: 'test_us_b@example.com',
                password: "Password1234!"
            }
        }
        const resB = createMockRes()
        await login(reqB, resB)
        assert.strictEqual(resB.statusCode, 200)
        assert.ok(resB.body.token)
        tokenB = resB.body.token
    })

    test('US2.2: Login rejects empty fields', async() => {
        // Login user A
        const reqA = {
            body: {
                email: '',
                password: "Password123!"
            }
        }
        const resA = createMockRes()
        await login(reqA, resA)
        assert.strictEqual(resA.statusCode, 400)
    })
}