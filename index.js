const express = require('express')
const app = express()
app.use(express.json())
app.use(express.static('build'))
const cors = require('cors')
app.use(cors())
const Person = require('./phonebook-cli/mongo')

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

app.get('/api', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons)
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
  const person = {
    name: body.name,
    number: generateNumber(),
    id: generateId(),
  }
  if (person.number === undefined) {
    return response.status(400).json({ error: 'Numeroa ei löydy' })
  }

  if (persons.map((y) => y.number).includes(person.number)) {
    return response.status(400).json({ error: 'Numeron pitää olla uniikki' })
  }

  persons = persons.concat(person)

  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter((person) => person.id !== id)
  response.status(204).end()
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log(id)
  const person = persons.find((person) => person.id === id)
  console.log(person)
  response.json(person)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
