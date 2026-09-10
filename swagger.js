const swaggerAutogen = require('swagger-autogen')

const doc = {
    info: {
        title: 'Appli archer',
        version: '1.0.0',
        description: 'Documentation API'
    },
    host: 'localhost:3000',
    basePath: '/',
    schemes: ['http']

}

const outputFile = './swagger-output.json'
const routes = ['./app.js']

swaggerAutogen(outputFile, routes, doc)

//Générer le fichier pour swagger avec:
//node swagger.js