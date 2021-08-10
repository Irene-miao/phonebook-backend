const Phone = require('../models/phone')
const User = require('../models/user')

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

// create database object ID that does not belong to any phone object in database
const nonExistingId = async () => {
  const phone = new Phone({ name: 'Willremovesoon', number: 11223344 })
  await phone.save()
  await phone.remove()

  return phone._id.toString()
}

// check contacts stored in database
const phonesInDb = async () => {
  const phones = await Phone.find({})
  return phones.map(phone => phone.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialContacts, nonExistingId, phonesInDb, usersInDb,
}