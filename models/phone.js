const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const process = require('process');

const url = process.env.MONGODB_URI

console.log('connecting to', url);

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true})
.then(result => {
    console.log('connected to MongoDB')
})
.catch((error) => {
    console.log('error connecting to MongDB:', error.message)
});

const phoneSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: [true, 'name missing'],
        unique: true,
        uniqueCaseInsensitive: true,
    },
    number: {
        type: Number,
        min: [09999999, 'Must be at least 8 digits, {VALUE}'],
        max: 099999999,
        required: [true, 'number missing']
    },
    date: {type: Date, default: Date.now},
    });

phoneSchema.plugin(uniqueValidator, {message: 'Error, expected {PATH} to be unique.'});

phoneSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Phone', phoneSchema);