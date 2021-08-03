// Create a new router object
const phonesRouter = require('express').Router()

const Phone = require('../models/phone')

// Get number of persons and request date
phonesRouter.get('/info', async (request, response) => {
  const contacts = await Phone.count({})
  response.json(`Phonebook has info for ${contacts.length} people ${new Date()}`)

})

// GET all persons
phonesRouter.get('/', async (request, response) => {
  const contacts = await Phone.find({})
  response.json(contacts.map(contact => contact.toJSON()))
})

// Get one person id
phonesRouter.get('/:id', async (request, response, next) => {
  const contact = await Phone.findById(request.params.id)
  if (contact) {
    response.json(contact)
  } else {
    response.status(404).end()
  }
})

// Delete one person id
phonesRouter.delete('/:id', async (request, response) => {
  await Phone.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

// Post a new person
phonesRouter.post('/', async (request, response) => {
  const person = request.body
  //const name = person.name.toLowerCase()

  /*Phone.find({}).then((contact) => {
    contact.map((item) => {
      const pnames = item.name
      pnames.filter((pname) => {
        if (name === pname.toLowerCase()) {
          response.status(404).send({ error: 'Name exist in phonebook' })
        }
      })
    })
  })*/

  const phone = new Phone({
    name: person.name,
    number: person.number,
    date: new Date(),
  })


  const savedPhone = await phone.save()
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
