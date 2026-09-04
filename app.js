const express = require('express')
const app = express()
const port = 3000

// require('dotenv').config()
// require('./config/database')

     URL
app.get('/', (req, res) =>{
    res.send('Bienvenue sur mon API RESTful !')
})

app.listen(port, () =>{
    // Ce console log s'affiche uniquement côté SERVEUR et non CLIENT
    console.log(`Serveur démarré sur http://localhost:${port}`)
})