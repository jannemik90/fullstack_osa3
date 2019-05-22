const mongoose = require('mongoose')

if(process.argv.length <3){
    console.log('give password as argument')
    process.exit(1)
}


const password = process.argv[2]
const personName = process.argv[3]
const personNumber = process.argv[4]



const url= `mongodb+srv://jannemik:${password}@fullstack2019-05srd.mongodb.net/test?retryWrites=true`

mongoose.connect(url, {useNewUrlParser: true})

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model("Person", personSchema)

if(!personName){
    console.log('Puhelinluettelo:')
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        process.exit(1)
        mongoose.connection.close();
    })
   
}

const person = new Person({
    name: personName,
    number: personNumber
})


person.save().then(response =>{
    console.log(`Lisätään ${personName} numero ${personNumber} luetteloon`)
    mongoose.connection.close();
})