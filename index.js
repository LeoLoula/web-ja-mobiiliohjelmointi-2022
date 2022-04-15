const express = require('express')
const app = express()
app.use(express.json())
app.use(express.static('build'))
const cors = require('cors')
app.use(cors())
const Person = require('./models/person.js')

const formatPerson = (person) => {
  const formattedPerson = { ...person._doc, id: person._id }
  delete formattedPerson._id
  delete formattedPerson.__v
  return formattedPerson
}

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1,
  },
  {
    name: 'Martti Tienari',
    number: '040-123456',
    id: 2,
  },
  {
    name: 'Arto Järvinen',
    number: '040-123456',
    id: 3,
  },
  {
    name: 'Lea Kutvonen',
    number: '040-123456',
    id: 4,
  },
  {
    name: 'Leo Loula',
    number: '044-3202090',
    id: 5,
  },
]

app.get('/api', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}, { __v: 0 }).then((person) => {
    response.json(person.map(formatPerson))
  })
})

const generateId = () => {
  const maxId =
    persons.length > 0
      ? persons
          .map((n) => n.id)
          .sort((a, b) => a - b)
          .reverse()[0]
      : 1
  return maxId + 1
}

const generateNumber = () => {
  return Math.floor(Math.random() * 1000000000000)
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  if (body.name === undefined) {
    return response.status(400).json({ error: 'Nimiä ei löydy' })
  }

  if (persons.map((x) => x.name).includes(body.name)) {
    return response.status(400).json({ error: 'Nimen pitää olla uniikki!' })
  }
  const person = new Person({
    name: body.name,
    number: generateNumber(),
    id: generateId(),
  })

  if (person.number === undefined) {
    return response.status(400).json({ error: 'Numeroa ei löydy' })
  }

  if (persons.map((y) => y.number).includes(person.number)) {
    return response.status(400).json({ error: 'Numeron pitää olla uniikki' })
  }

  persons = persons.concat(person)

  response.json(person)
  person.save().then((savedPerson) => {
    response.json(formatPerson(savedPerson))
  })
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end()
    })
    .catch((error) => {
      response.status(400).send({ error: 'malformed id' })
    })
  const id = Number(request.params.id)
  persons = persons.filter((person) => person.id !== id)

  response.status(204).end()
})

app.put('/api/persons/:id', (request, response) => {
  const body = request.body

  const person = {
    name: body.name,
    number: generateRandomInt(3),
    id: generateId,
  }
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(formatPerson(updatedPerson))
    })
    .catch((error) => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(formatPerson(person))
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
