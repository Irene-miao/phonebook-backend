const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const Phone = require('../models/phone')
const initialContacts = [
  {
    name: 'flower',
    number: 11223344,
  },
  {
    name: 'Bomer',
    number: 11879456,
  },
]

beforeEach(async () => {
  await Phone.deleteMany({})
  let phoneObject = new Phone(initialContacts[0])
  await phoneObject.save()
  phoneObject = new Phone(initialContacts[1])
  await phoneObject.save()
})

test('persons are returned as json', async () => {
  await api
    .get('/api/persons')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two persons', async () => {
  const response = await api.get('/api/persons')

  expect(response.body).toHaveLength(initialContacts.length)
})

test('a specific contact is within the returned contacts', async () => {
  const response = await api.get('/api/persons')

  const names = response.body.map( r => r.name)
  expect(names).toContain('Bomer')
})

afterAll(() => {
  mongoose.connection.close()
})