require('dotenv').config()
const process = require('process')

//  Use the port defined in environment variable PORT or
//  port 3001 if the environment variable PORT is undefined
const PORT = process.env.PORT

const mongoUrl = process.env.NODE_ENV === 'test'
  ? process.env.TEST_mongoUrl
  : process.env.mongoUrl


module.exports = {
  mongoUrl,
  PORT,
  
}
