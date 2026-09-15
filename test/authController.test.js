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

describe('US1: User registration ', () => {
    let userA, userB
    const testEmails = ['test_us_a@example.com', 'test_us_b@example.com']

    // Clean before test
    before(async () => {
        await pool.query('DELETE FROM "Users" WHERE email_user=ANY($1)', [testEmails])
    })

    after(async () => {
        await pool.query('DELETE FROM "Users" WHERE email_user=ANY($1)', [testEmails])
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

        // Email duplicated
        const resDup = createMockRes()
        await register(reqA, resDup)
        assert.strictEqual(resDup.statusCode, 400)
    })

    // Non-compliant password
    test('US1.3: Register rejects weak password', async () => {
        // Register user C
        const reqC = {
            body: {
                pseudo:'Charlie',
                email: 'test_us_c@example.com',
                password: 'Password12'
            }
        }

        const resC = createMockRes()
        await register(reqC, resC)
        assert.strictEqual(resC.statusCode, 400)
    })

    // Non-compliant email
    test('US1.4: Register rejects non-compliant email', async () => {
        // Register user D
        const reqD = {
            body: {
                pseudo:'David',
                email: 'test_us_d',
                password: 'Password123!'
            }
        }

        const resD = createMockRes()
        await register(reqD, resD)
        assert.strictEqual(resD.statusCode, 400)
    })

    // Fields are empty
    test('US1.5: Register rejects empty fields', async () => {
        // Register user E
        const reqE = {
            body: {
                pseudo:'Alice',
                email: 'test_us_a@example.com',
                password: ''
            }
        }

        const resE = createMockRes()
        await register(reqE, resE)
        assert.strictEqual(resE.statusCode, 400)
    })
})

describe('US2: User login', () => {
    let tokenA
    const userA = {
        pseudo:'Alice',
        email: 'test_us_a@example.com',
        password: 'Password123!'
    }

    // Clean before test
    before(async () => {
        await pool.query('DELETE FROM "Users" WHERE email_user = $1', [userA.email])

        const resRegister = createMockRes() 
        await register(
            {body: userA},
            resRegister
        )
    })

    // Clean after
    after(async () => {
        await pool.query('DELETE FROM "Users" WHERE email_user = $1', [userA.email])
        await pool.end()
    })

    test('US2.1: Login user with valid credentials', async() => {

        // Login user A
        const reqA = {
            body: {
                email: 'test_us_a@example.com',
                password: "Password123!"
            }
        }
        
        const resA = createMockRes()
        await login(reqA, resA)
        assert.strictEqual(resA.statusCode, 200)
        assert.ok(resA.body.token)
        tokenA = resA.body.token
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

    test('US2.3: Login rejects invalid email', async() => {
        // Login user A
        const reqA = {
            body: {
                email: 'test_login@example.com',
                password: "Password123!"
            }
        }
        const resA = createMockRes()
        await login(reqA, resA)
        assert.strictEqual(resA.statusCode, 401)
    })

    test('US2.4: Login rejects invalid password', async() => {
        // Login user A
        const reqA = {
            body: {
                email: 'test_us_a@example.com',
                password: "WrongPassword"
            }
        }
        const resA = createMockRes()
        await login(reqA, resA)
        assert.strictEqual(resA.statusCode, 401)
    })
})