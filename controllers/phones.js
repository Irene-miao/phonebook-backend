// Create a new router object
const notesRouter = require('express').Router()

const Phone = require('../models/phone')

// Get number of persons and request date
notesRouter.get('/info', (request, response, next) => {
  Phone.count({})
    .then((contact) => {
      response.json(`Phonebook has info for ${contact} people ${new Date()}`)
    })
    .catch((error) => next(error));
})

// GET all persons
notesRouter.get('/', (request, response) => {
  Phone.find({}).then((contact) => {
    response.json(contact)
  })
})

// Get one person id
notesRouter.get('/:id', (request, response, next) => {
  Phone.findById(request.params.id)
    .then((phone) => {
      if (phone) {
        response.json(phone)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

// Delete one person id
notesRouter.delete('/:id', (request, response, next) => {
  Phone.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// Post a new person
notesRouter.post('/', (request, response, next) => {
  const person = request.body
  const name = person.name.toLowerCase()

  Phone.find({}).then((contact) => {
    contact.map((item) => {
      const pnames = item.name
      pnames.forEach((pname) => {
        if (name === pname.toLowerCase()) {
          response.status(404).send({ error: 'Name exist in phonebook' })
        }
      })
    })
  })
  const phone = new Phone({
    name: person.name,
    number: person.number,
    date: new Date(),
  })

  phone
    .save()
    .then((savedPhone) => {
      console.log(savedPhone)
      return savedPhone.toJSON() // Received object from Mongoose and format it
    })
    .then((savedAndFormattedPhone) => {
      response.json(savedAndFormattedPhone) // Access the formatted phone
    })
    .catch((error) => next(error))
})

// Update a person number
notesRouter.put('/:id', (request, response, next) => {
  const person = request.body

  const phone = {
    number: person.number,
  }

  Phone.findByIdAndUpdate(request.params.id, phone, { new: true })
    .then((updatedPhone) => {
      response.json(updatedPhone)
    })
    .catch((error) => next(error))
})

module.exports = notesRouter  // Export the module
