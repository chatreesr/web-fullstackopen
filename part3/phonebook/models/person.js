const mongoose = require('mongoose')

// Set mongoose options
mongoose.set('strictQuery', false)

mongoose
  .connect(process.env.MONGODB_URI)
  .then((result) => {
    console.log(`Connected to MongoDB at ${process.env.MONGODB_URI}`)
  })
  .catch((error) => {
    console.log(`Error connecting to MongoDB: ${error.message}`)
  })

// Build a person schema
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = new mongoose.model('Person', personSchema)
