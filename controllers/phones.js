// Create a new router object
const phonesRouter = require('express').Router()
const Phone = require('../models/phone')
const User = require('../models/user')
const jwt = require('jsonwebtoken')



// Get number of persons and request date
phonesRouter.get('/info', async (request, response) => {
  const contacts = await Phone.count({})
  response.json(`Phonebook has info for ${contacts.length} people ${new Date()}`)

})

// GET all persons
phonesRouter.get('/', async (request, response) => {
  const contacts = await Phone
    .find({}).populate('user', { username: 1, name: 1 })
    // ids referencing user objects in users field of phone document replaced by referenced user documents
  response.json(contacts.map(contact => contact.toJSON()))
})

// Get one person id
phonesRouter.get('/:id', async (request, response, next) => {
  const contact = await Phone.findById(request.params.id)
  if (contact) {
    response.json(contact.toJSON())
  } else {
    response.status(404).end()
  }
})

// Delete one person id
phonesRouter.delete('/:id', async (request, response) => {
  await Phone.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

// Isolate token from authorization header
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

// Post a new person
phonesRouter.post('/', async (request, response) => {
  const person = request.body


  const token = getTokenFrom(request)
  // token checked with jwt.verify
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  console.log(decodedToken)
  const user = await User.findById(decodedToken.id)

  const phone = new Phone({
    name: person.name,
    number: person.number,
    date: new Date(),
    user: user._id
  })


  const savedPhone = await phone.save()
  // id of phone is stored in phones field
  user.phones = user.phones.concat(savedPhone._id)
  await user.save()

  response.json(savedPhone) // Access the formatted phone
})

// Update a person number
phonesRouter.put('/:id', (request, response, next) => {
  const person = request.body

  const phone = {
    number: person.number,
  }

  Phone.findByIdAndUpdate(request.params.id, phone, { new: true })
    .then(contact => {
      response.json(contact.toJSON())
    }).catch(error => next(error))
})

module.exports = phonesRouter  // Export the module
