const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

mongoose.connect('mongodb://localhost/todo-vue')
    .then(db => console.log(`Successfully connected to ${db.connection.db.databaseName}`))
    .catch(err => console.error(err))

    // Settings
app.set('port', process.env.PORT || 3000)

// Middlewares
app.use(morgan('dev'))
app.use(express.json())
app.use(cors())

// Routes
app.use('/api/todos', require('./routes/todos'))

// Static Files
app.use(express.static(__dirname + '/public'))

// Start server
app.listen(app.get('port'), () => {
    console.log('Server started on port ' + app.get('port'))
})
