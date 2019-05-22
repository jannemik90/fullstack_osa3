require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')



app.use(bodyParser.json())
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('build'))





app.get('/api/persons', (req,res) =>{
   Person.find({}).then(persons => {
     res.json(persons.map(person => person.toJSON()))
   })
})

app.post('/api/persons', (req,res, next) =>{

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



  // const personsWithSameName = Person.find({name: body.name})
  //   console.log(personsWithSameName)
  // if(personsWithSameName){
  //   return res.status(400).json({
  //     error: 'name already exists'
  //   })
  // }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    res.json(savedPerson.toJSON())
  })
  .catch(error => next(error))
})

app.get('/api/persons/:id', (req,res,next) =>{
  const id = req.params.id
  console.log(id)
  Person.findById(id)
   .then(person =>{
     res.json(person.toJSON())
   })
   .catch(error => next(error))
})

app.put('/api/persons/:id', (req,res, next) =>{
    const body = req.body
    const id = req.params.id
    const person = {
      name: body.name,
      number: body.number
    }
    Person.findByIdAndUpdate(id, person, {new: true})
     .then(updatedPerson =>{
       res.json(updatedPerson.toJSON())
     })
     .catch(error => next(error))
})

app.delete('/api/persons/:id', (req,res, next) =>{
    const id = req.params.id
    Person.findByIdAndDelete(id)
      .then(result => {
        res.status(204).end()
      })
      .catch(error => next)
   
})


app.get('/info', (req,res) =>{
    Person.find({})
    .then(persons => {
      res.send(
        `<p>Puhelinluettelossa ${persons.length} henkilön tiedot</p>
        <p>${new Date()}</p>`
    )
    })
})


const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if(error.name === 'ValidationError'){
    return response.status(400).json({error: error.message})
  }

  next(error)
}

app.use(unknownEndpoint)

app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})