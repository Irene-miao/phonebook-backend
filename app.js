const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const phonesRouter = require('./controllers/phones')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

logger.info('connecting to', config.mongoUrl)

mongoose
  .connect(config.mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    logger.info('connected to MongoDB') // Access info function in logger.js
  })
  .catch((error) => {
    logger.error('error connecting to MongDB:', error.message) // Access error function in logger.js
  })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger) // Access requestLogger middleware in middleware.js

app.use('/api/persons', phonesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler) // this has to be the last loaded middleware

module.exports = app