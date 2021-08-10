const bcrypt = require('bcrypt')
// Create a new router object
const usersRouter = require('express').Router()
const User = require('../models/user')

// Return all users in database
usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('phones', { name: 1, number: 1 })
  // ids referencing phone objects in phones field of user document replaced by referenced phone documents
  // use populate parameter to choose fields to include from documents
  response.json(users.map(u => u.toJSON()))
})

// Create a new user in database
usersRouter.post('/', async (request, response) => {
  const body = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

module.exports = usersRouter