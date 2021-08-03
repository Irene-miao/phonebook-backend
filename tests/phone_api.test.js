const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)
const Phone = require('../models/phone')


beforeEach(async () => {
  await Phone.deleteMany({})
  await Phone.insertMany(helper.initialContacts)
})

describe('when there is initially some notes saved', () => {
  test('persons are returned as json', async () => {
    await api
      .get('/api/persons')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all contacts are returned', async () => {
    const response = await api.get('/api/persons')

    expect(response.body).toHaveLength(helper.initialContacts.length)
  })

  test('a specific contact is within the returned contacts', async () => {
    const response = await api.get('/api/persons')

    const names = response.body.map( r => r.name)

    expect(names).toContain('Bomer')
  })

})


describe('viewing a specific note', () => {
  test('a specific contact can be viewed with valid id', async () => {
    const contactsAtStart = await helper.phonesInDb()

    const contactToView = contactsAtStart[0]
    console.log(contactToView)
    const resultContact = await api
      .get(`/api/persons/${contactToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    console.log(resultContact)
    const processedContactToView = JSON.parse(JSON.stringify(contactToView))
    // Check the specific contact is the same as searched one in database
    expect(resultContact.body).toEqual(processedContactToView)
  })

  test('fails with status code 404 if contact do not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    console.log(validNonexistingId)

    await api
      .get(`/api/persons/${validNonexistingId}`)
      .expect(404)
  })

  test('fails with status code 400 id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .get(`/api/persons/${invalidId}`)
      .expect(400)
  })

})

describe('add new contact', () => {
  test('a valid contact can be added', async () => {
    const newContact = {
      name: 'Totter',
      number: 12345678,
    }

    await api
      .post('/api/persons')
      .send(newContact)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const phonesAtEnd = await helper.phonesInDb()
    expect(phonesAtEnd).toHaveLength(helper.initialContacts.length + 1)
    const names = phonesAtEnd.map(r => r.name)

    expect(names).toContain('Totter')
  })

  test('contact without name is not added', async () => {
    const newContact = {
      contact: 87654321,
    }

    await api
      .post('/api/persons')
      .send(newContact)
      .expect(400)

    const response = await api.get('/api/persons')

    expect(response.body).toHaveLength(initialContacts.length)
  })

})

describe('deletion of contact', () => {
  test('a contact can be deleted', async () => {
    const contactsAtStart = await helper.phonesInDb()
    const contactToDelete = contactsAtStart[0]

    await api
      .delete(`/api/persons/${contactToDelete.id}`)
      .expect(204)

    const contactsAtEnd = await helper.phonesInDb()
    // Check the total number of contacts is less by 1
    expect(contactsAtEnd).toHaveLength(helper.initialContacts.length - 1)

    const names = contactsAtEnd.map(r => r.name)
    // Check names in database do not contain deleted name
    expect(names).not.toContain(contactToDelete.name)
  })
})

afterAll(() => {
  mongoose.connection.close()
})