const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()

// Middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())
app.use(express.static('public'))

//  mongodb  connection 

mongoose.connect(process.env.MONGODB_URI)

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('connected to MongoDB')

})

//Form schema and model for mongoDB collection

const contactSchema = new mongoose.Schema({
  name: String,
  people: Number,
  date: Date,
  message: String,
})

const Contact = mongoose.model('Contact', contactSchema)

// submission request for form (/submit route)
app.post('/submit', async (req, res) => {
  const formData = {
    name: req.body.Name,
    people: req.body.People,
    date: new Date(req.body.Date),
    message: req.body.Message,
  }
  
  
  try {
    const newContact = new Contact(formData)
    await newContact.save()  //post being saved to database using contactSchema
    res.redirect('/?success')
    console.log(req)
  } catch (error) {
    res.redirect('/?error')
  }
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
})
// define server port

const PORT = 8000
app.listen(PORT, () => {

  console.log(`Server listening on ${PORT}`)
})