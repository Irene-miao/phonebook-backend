const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('persons are returned as json', async () => {
  await api
    .get('/api/persons')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are five persons', async () => {
  const response = await api.get('/api/persons')

  expect(response.body).toHaveLength(5)
})

test('the first person is Bob', async () => {
  const response = await api.get('/api/persons')

  expect(response.body[0].name).toBe('Bob')
})

afterAll(() => {
  mongoose.connection.close()
})