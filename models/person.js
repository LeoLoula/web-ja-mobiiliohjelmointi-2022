const mongoose = require('mongoose')
const url =
  'mongodb+srv://leol:Y27mijefCUdoXEWJ@cluster0.rbz33.mongodb.net/phonebookapp?retryWrites=true&w=majority'

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person
