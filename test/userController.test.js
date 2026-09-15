const { test, describe, before, after} = require('node:test')
const assert = require('node:assert')

const {profile, updateProfile} = require('../config/database')
const {pool} = require('../config/database')

// Helper mock response
const createMockRes = () => {
    
}