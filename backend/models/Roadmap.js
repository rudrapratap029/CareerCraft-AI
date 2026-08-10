const mongoose = require('mongoose');

const taskNodeSchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  duration: String, // e.g. "2 Weeks"
  category: String, // e.g. "Core Fundamentals", "Advanced Concepts", "Hands-on Project"
  resources: [String],
  projectIdea: String,
  completed: { type: Boolean, default: false }
}, { _id: false });

const milestoneStageSchema = new mongoose.Schema({
  stageNumber: Number,
  stageTitle: String,
  stageSummary: String,
  estimatedDuration: String,
  tasks: [taskNodeSchema]
}, { _id: false });

const roadmapSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetRole: {
    type: String,
    required: true
  },
  currentLevel: {
    type: String,
    default: 'Intermediate'
  },
  durationWeeks: {
    type: Number,
    default: 12
  },
  stages: [milestoneStageSchema],
  overallProgress: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Roadmap', roadmapSchema);
