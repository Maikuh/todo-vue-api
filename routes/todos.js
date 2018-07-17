const express = require('express')
const Todo = require('../models/Todo')
const passport = require('passport')

const router = express.Router()

// Get all todos
router.get('/', passport.authenticate('jwt', {session: false}), async (req, res) => {
    // Get all todos, excluding timestamps fields
    const todos = await Todo.find({creator: req.user.id}, { createdAt: 0, updatedAt: 0 })
    
    res.json(todos)
})

// Get single todo
router.get('/:id', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
        const todo = await Todo.findOne({_id: req.params.id, creator: req.user.id}, { createdAt: 0, updatedAt: 0 })

        if (!todo)
            res.status(404).json({message: "Todo doesn't exist"})
        else
            res.json(todo)
    } catch (err) {
        res.send(err)
    }
})

// Create new todo
router.post('/', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
        const todo = new Todo(req.body)
        todo.creator = req.user.id

        await todo.save()
        res.status(201).json(todo)      
    } catch (err) {
        res.send(err)
    }
})

// Edit/Update single todo
router.patch('/:id', passport.authenticate('jwt', {session: false}), async (req, res) => {
    const todo = await Todo.findOneAndUpdate({_id: req.params.id, creator: req.user.id}, req.body, { createdAt: 0, updatedAt: 0 })

    if (!todo)
        res.status(404).json({message: "Todo doesn't exist"})
    else
        res.status(200).json({message: "Todo updated"})
})

// Edit/Update all todos (completed property, for CheckAll)
router.patch('/', passport.authenticate('jwt', {session: false}), async (req, res) => {
    const todos = await Todo.updateMany({creator: req.user.id}, {completed: req.body.completed})

    res.status(200).json({message: 'Updated all'})
})

// Delete single todo
router.delete('/:id', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
        await Todo.findOneAndRemove({_id: req.params.id, creator: req.user.id})

        res.status(200).json({status: 'Todo deleted'})    
    } catch (err) {
        res.json(err)
    }
})

// Delete many todos (for ClearCompleted)
router.delete('/', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
        await Todo.deleteMany({creator: req.user.id, completed: true})

        res.status(200).json({message: 'Cleared completed'})
    } catch (err) {
        console.log(err)        
    }
})

module.exports = router