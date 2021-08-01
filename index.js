const app = require('./app')
const http = require('http')
const config = require('./utils/config') // Access the env variables by importing configuration module
const logger = require('./utils/logger')

/*const morgan = require('morgan')
morgan.token('body', (request) => JSON.stringify(request.body))
// Create morgan token for body

/app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms  :body '
  )
)*/

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

const server = http.createServer(app)


server.listen(config.PORT, () => {  // Access env variables in config.js
  logger.info(`Server running on port ${config.PORT}`)  // Access info function in logger.js
})
