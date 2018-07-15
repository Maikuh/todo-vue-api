const express = require('express')
const Todo = require('../models/Todo')

const router = express.Router()

// Get all todos
router.get('/', async (req, res) => {
    // Get all todos, excluding timestamps fields
    const todos = await Todo.find({}, { createdAt: 0, updatedAt: 0 })

    res.json(todos)
})

// Get single todo
router.get('/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id, { createdAt: 0, updatedAt: 0 })

        res.json(todo)
    } catch (err) {
        res.send(err)
    }
})

// Create new todo
router.post('/', async (req, res) => {
    try {
        const todo = new Todo(req.body)
        await todo.save()
    
        res.status(201).json(todo)      
    } catch (err) {
        res.send(err)
    }
})

// Edit/Update single todo
router.patch('/:id', async (req, res) => {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { createdAt: 0, updatedAt: 0 })

    res.status(200).json(await Todo.findById(req.params.id, { createdAt: 0, updatedAt: 0 }))
})

// Edit/Update all todos (completed property, for CheckAll)
router.patch('/', async (req, res) => {
    const todos = await Todo.updateMany({}, {completed: req.body.completed})

    res.status(200).json({message: 'Updated all'})
})

// Delete single todo
router.delete('/:id', async (req, res) => {
    try {
        await Todo.findByIdAndRemove(req.params.id)

        res.status(200).json({status: 'Todo deleted'})    
    } catch (err) {
        res.json(err)
    }
})

// Delete many todos (for ClearCompleted)
router.delete('/', async (req, res) => {
    try {
        await Todo.deleteMany({completed: true})

        res.status(200).json({message: 'Cleared completed'})
    } catch (err) {
        console.log(err)        
    }
})

module.exports = router