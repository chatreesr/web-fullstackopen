const mongoose = require('mongoose')

// Check if password is provided
if (process.argv.length < 3) {
  console.log('Please provide your database password.')
  process.exit(1)
}

// Parse password
const password = process.argv[2]

// Set mongoose options
mongoose.set('strictQuery', false)

// Connect to the database
const dbUrl = `mongodb+srv://chatree:${password}@development.xlobvzc.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=development`

mongoose.connect(dbUrl)

// Build a person schema
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

// Build the mongoose model
const Person = new mongoose.model('Person', personSchema)

// Fetch data from the database if only password is provided
if (process.argv.length === 3) {
  // List all notes
  console.log('phonebook:')
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  // Build a new person from arguments
  const name = process.argv[3]
  const number = process.argv[4]
  const person = new Person({
    name,
    number,
  })

  person.save().then((result) => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  console.log('Name and number must exist.')
  mongoose.connection.close()
  process.exit(1)
}
