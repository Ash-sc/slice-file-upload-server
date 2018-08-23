const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require('path')
const config = require('./config')

const app = express()

app.use('/static/', express.static(path.resolve(__dirname, 'static')))

app.use(bodyParser.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({
  extended: false
}))

// set json header
app.use(function (req, res, next) {
  res.contentType('application/json')
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
})

const uploadController = require('./controllers/uploadController')

app.use('/', uploadController)

app.use((req, res) => {
  res.status(404).send('')
})

app.listen(config.port || 6677)

module.exports = app
