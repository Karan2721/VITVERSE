const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  assignedto: String,
  assignedby: String,
  currentDate: Date,
  status: String
});

module.exports = mongoose.model('Task', taskSchema); 
