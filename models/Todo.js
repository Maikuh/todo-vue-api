const mongoose = require('mongoose')
const { Schema } = mongoose

const Todo = new Schema({
    title: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Todo', Todo)