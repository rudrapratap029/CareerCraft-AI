const mongoose = require('mongoose');

const questionItemSchema = new mongoose.Schema({
  id: String,
  category: {
    type: String,
    enum: ['Technical', 'Behavioral', 'System Design', 'Situational'],
    default: 'Technical'
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  question: String,
  hint: String,
  modelAnswer: String,
  userAnswer: String,
  aiFeedback: {
    score: { type: Number, min: 0, max: 10 },
    strengths: [String],
    areasForImprovement: [String],
    improvedAnswerSuggestion: String
  }
}, { _id: false });

const interviewSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetRole: {
    type: String,
    required: true
  },
  companyOrDomain: {
    type: String,
    default: 'General Software Engineering'
  },
  questions: [questionItemSchema],
  overallScore: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['In Progress', 'Completed'],
    default: 'In Progress'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);
