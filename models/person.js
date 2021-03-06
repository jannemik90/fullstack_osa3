const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI






mongoose.connect(url, { useNewUrlParser: true })
  // eslint-disable-next-line no-unused-vars
  .then(result => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.log('error: ', error.message)
  })

const personSchema = new mongoose.Schema({
  name: { type:String , required: true, unique: true, minlength: 3 },
  number: { type:String , required: true, minlength: 8 }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

personSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Person', personSchema)