const mongoose = require('mongoose')

const url =
  'mongodb+srv://<user>:<password>cluster0.rbz33.mongodb.net/phonebookapp?retryWrites=true&w=majority'

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: process.argv[2],
  number: process.argv[3],
  id: 2,
})

if (process.argv[2] === undefined) {
  Person.find({}).then((persons) => {
    console.log('Puhelinluettelo:')
    persons.forEach((person) => {
      console.log(person.name + ' ' + person.number)
    })
    mongoose.connection.close()
  })
} else {
  console.log(
    `adding person ${process.argv[2]} number ${process.argv[3]} to the directory: `
  )
  person.save().then((result) => {
    mongoose.connection.close()
  })
}
