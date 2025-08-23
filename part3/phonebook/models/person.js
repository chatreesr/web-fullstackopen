const mongoose = require('mongoose')

// Set mongoose options
mongoose.set('strictQuery', false)

console.log(`Connecting to MongoDB at ${process.env.MONGODB_URI}`)
mongoose
  .connect(process.env.MONGODB_URI)
  .then((result) => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.log(`Error connecting to MongoDB: ${error.message}`)
  })

// Build a person schema
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: [true, 'name required'],
  },
  number: {
    type: String,
    minLength: 8,
    required: [true, 'phone number required'],
    validate: {
      validator: (v) => {
        return /^\d{2,3}-\d+$/.test(v)
      },
      message: (props) => {
        return `${props.value} is not a valid phone number`
      },
    },
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = new mongoose.model('Person', personSchema)
