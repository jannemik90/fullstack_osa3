const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')



app.use(bodyParser.json())
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())


let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Martti Tienari",
      "number": "040-123456",
      "id": 2
    },
    {
      "name": "Kalle Kivi",
      "number": "2141441",
      "id": 3
    },
    {
      "name": "Rami Mujenki",
      "number": "213213123",
      "id": 4
    }
  ]


app.get('/', (req,res) =>{
    res.send('<h1>Hello!</h1>')
})


app.get('/api/persons', (req,res) =>{
    res.json(persons)
})

app.post('/api/persons', (req,res) =>{

  const body = req.body

  if(!body.name){
    return res.status(400).json({
      error: 'name missing'
    })
  }
  if(!body.number){
    return res.status(400).json({
      error: 'number missing'
    })
  }

  const personsWithSameName = persons.find(person => person.name.toLowerCase() === body.name.toLowerCase())

  if(personsWithSameName){
    return res.status(400).json({
      error: 'name already exists'
    })
  }

  const id = Math.floor(Math.random() * 9999)

  const person = {
    name: body.name,
    number: body.number,
    id: id
  }

  persons = persons.concat(person)
  res.json(person)
})

app.get('/api/persons/:id', (req,res) =>{
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if(person){
        res.json(person)
    }else {
        res.status(404).end()
    }
    
})

app.delete('/api/persons/:id', (req,res) =>{
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})


app.get('/info', (req,res) =>{
    res.send(
        `<p>Puhelinluettelossa ${persons.length} henkilön tiedot</p>
        <p>${new Date()}</p>`
    )
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})