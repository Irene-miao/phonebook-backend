
const express = require('express');
const app = express();
require('dotenv').config();
const Phone = require('./models/phone');

const morgan = require('morgan');
morgan.token('body', (req, res) => JSON.stringify(req.body));
// Create morgan token for body
app.use(morgan(':method :url :status :res[content-length] - :response-time ms  :body '));
const cors = require('cors');
app.use(cors());
app.use(express.static('build'));
app.use(express.json());

// Middleware that print information about every request sent to server
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method);
  console.log('Path: ', request.path);
  console.log('Body: ', request.body);
  console.log('---');
  next()   // next function yields control to next middleware
};
app.use(requestLogger);

// Mongoose database
/*if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>');
  process.exit(1)
};*/

//const password = process.argv[2];
// Get the input from the console to add to database
/*const name = process.argv[3];
const number = process.argv[4];

const phone = new Phone({
  name: name,
  number: number,
});

if (process.argv.length > 3) {
  phone.save().then(result => {
      console.log(`added ${result.name} number ${result.number} to phonebook`);
      mongoose.connection.close()
  });
} else {
Phone.find({}).then(contact => {
  console.log('phonebook:');
  contact.map(item => {
      console.log(item.name, item.number);
  });
  mongoose.connection.close()
});
};*/

// Get number of persons and request date
app.get('/info', (request, response, next) => {
Phone.count({}).then(contact => {
  response.json(`Phonebook has info for ${contact} people ${new Date()}`);
})
.catch(error => next(error))
});

// GET all persons
app.get('/api/persons', (request, response) => {
  Phone.find({}).then(contact => {
    response.json(contact)
  });
});

// Get one person id
app.get('/api/persons/:id', (request, response) => {
 Phone.findById(request.params.id)
 .then(phone => {
   if (phone) {
    response.json(phone)
   } else {
     response.status(404).end()
   }
 })
 .catch(error =>  next(error))
});

// Delete one person id
app.delete('/api/persons/:id', (request, response, next) => {
  Phone.findByIdAndRemove(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
});

// Post a new person
app.post('/api/persons', (request, response, next) => {
  
  const person = request.body;

    const phone = new Phone({
      name: person.name,
      number: person.number,
      date: new Date(),
    });

   phone.save()
   .then(savedPhone => {
     console.log(savedPhone);
   return savedPhone.toJSON()  // Received object from Mongoose and format it
   })
   .then(savedAndFormattedPhone => {
     response.json(savedAndFormattedPhone)  // Access the formatted phone
   })
   .catch(error => next(error))
});

// Update a person number
app.put('/api/persons/:id', (request, response, next) => {
  const person = request.body;

  const phone = {
    number: person.number,
  }

  Phone.findByIdAndUpdate(request.params.id, phone, {new: true})
  .then(updatedPhone => {
    response.json(updatedPhone)
  })
  .catch(error => next(error))
});

// Middleware that catch requests made to non-existing routes
const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
};
app.use(unknownEndpoint);

// Middleware that catch errors
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  // the error was caused by an invalid object id for Mongo
  if (error.name === 'CastError') {
    return response.status(400).send({error: 'malformatted id'})
  } else if (error.name === 'ValidationError') {   // input does not pass validators eg: minLength not met
return response.status(400).json({ error: error.message })
  }
  next(error)
};

// // this has to be the last loaded middleware
app.use(errorHandler);

//  Use the port defined in environment variable PORT or 
// port 3001 if the environment variable PORT is undefined
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
