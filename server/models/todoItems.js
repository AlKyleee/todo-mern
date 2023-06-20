const mongoose = require('mongoose');

const ToDoItemSchema = new mongoose.Schema({
    item: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    quantity:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('todo', ToDoItemSchema);