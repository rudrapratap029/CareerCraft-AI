const mongoose = require('mongoose');

const skillRatingSchema = new mongoose.Schema({
  skill: String,
  category: {
    type: String,
    enum: ['Frontend', 'Backend', 'Database', 'DevOps & Tools', 'System Architecture', 'Soft Skills', 'Other'],
    default: 'Other'
  },
  rating: { type: Number, min: 0, max: 100 }, // 0 - 100
  marketDemand: { type: String, enum: ['High', 'Medium', 'Emerging'], default: 'High' }
}, { _id: false });

const resumeAnalysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumeTitle: {
    type: String,
    default: 'My Resume'
  },
  rawText: {
    type: String,
    required: true
  },
  targetRole: {
    type: String,
    default: 'Full Stack Developer'
  },
  overallAtsScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  formattingScore: Number,
  impactScore: Number,
  keywordScore: Number,
  summary: String,
  strengths: [String],
  improvements: [String],
  missingKeywords: [String],
  extractedSkills: [skillRatingSchema],
  softSkills: [String],
  hardSkills: [String],
  sectionAudit: {
    contactInfo: { status: String, feedback: String },
    summarySection: { status: String, feedback: String },
    workExperience: { status: String, feedback: String },
    projects: { status: String, feedback: String },
    skillsSection: { status: String, feedback: String },
    education: { status: String, feedback: String }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
