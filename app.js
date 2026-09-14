// Importing packages
const express = require('express')
const app = express()
// const cors = require('cors')
// const helmet= require('helmet')
// const rateLimit = require('express-rate-limit')

// const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger-output.json')

// Adresse
const port = 3000

const {connectDB} = require('./config/database')

// Connect to DB
const startServer = async () => {
    await connectDB()
}

// Importing routes
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const trainingRoutes = require('./routes/trainingRoutes')

// Limiter le nb d'appel à notre API
// const limiter = rateLimit({
//     windoMs: 15 * 60 * 1000,
//     limit: 100,
//     message: { status: 429, error: 'Too many requests, please try again later.'}
// })

app.use(express.json())
// app.use(
//     helmet({
//         contentSecurityPolicy: false,
//         crossOriginResourcePolicy: {policy: "cross-origin"}
//     })
// )
// app.use(cors())
// app.use(limiter)

// Monte le router sur le chemin de base
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/trainings', trainingRoutes)

startServer()

    //  URL
app.get('/', (req, res) =>{
    res.send('Bienvenue sur mon API RESTful !')
})

app.listen(port, () =>{
    // Ce console log s'affiche uniquement côté SERVEUR et non CLIENT
    console.log(`Serveur démarré sur http://localhost:${port}`)
})