const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const InterviewSession = require('../models/InterviewSession');
const { generateInterviewQuestions, evaluateAnswer } = require('../services/aiService');

// @route   POST /api/interview/generate
// @desc    Generate resume & job tailored interview questions
router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const { targetRole, skills, companyOrDomain, experienceLevel } = req.body;
    const role = targetRole || req.user.targetRole || 'Full Stack Developer';
    const knownSkills = Array.isArray(skills) ? skills : [];
    const level = experienceLevel || 'Mid Level';

    const questions = await generateInterviewQuestions(knownSkills, role, level);

    let savedSession = null;
    try {
      const sessionDoc = new InterviewSession({
        user: req.user.id,
        targetRole: role,
        companyOrDomain: companyOrDomain || 'General Software Engineering',
        questions: questions
      });
      savedSession = await sessionDoc.save();
    } catch (dbErr) {
      console.warn('Interview session DB save skipped:', dbErr.message);
    }

    res.json({
      success: true,
      session: {
        id: savedSession ? savedSession._id : 'temp_int_' + Date.now(),
        targetRole: role,
        companyOrDomain: companyOrDomain || 'General Software Engineering',
        questions,
        createdAt: new Date()
      }
    });

  } catch (error) {
    console.error('Interview Generation Route Error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate interview questions.' });
  }
});

// @route   POST /api/interview/evaluate
// @desc    Evaluate candidate answer for a specific question using AI
router.post('/evaluate', authMiddleware, async (req, res) => {
  try {
    const { questionId, questionText, userAnswer, modelAnswer, sessionId } = req.body;

    if (!userAnswer || userAnswer.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a complete response to get AI feedback.'
      });
    }

    const evaluation = await evaluateAnswer(questionText, userAnswer, modelAnswer);

    // Update DB session if sessionId exists
    if (sessionId && !sessionId.startsWith('temp_')) {
      try {
        const session = await InterviewSession.findOne({ _id: sessionId, user: req.user.id });
        if (session) {
          const qIndex = session.questions.findIndex(q => q.id === questionId);
          if (qIndex !== -1) {
            session.questions[qIndex].userAnswer = userAnswer;
            session.questions[qIndex].aiFeedback = evaluation;
          }

          // Calculate average score of answered questions
          const answered = session.questions.filter(q => q.aiFeedback && q.aiFeedback.score);
          if (answered.length > 0) {
            const sum = answered.reduce((acc, q) => acc + q.aiFeedback.score, 0);
            session.overallScore = Number((sum / answered.length).toFixed(1));
          }

          if (answered.length === session.questions.length) {
            session.status = 'Completed';
          }

          await session.save();
        }
      } catch (dbErr) {
        console.warn('DB evaluation save skipped:', dbErr.message);
      }
    }

    res.json({
      success: true,
      evaluation
    });

  } catch (error) {
    console.error('Answer Evaluation Error:', error);
    res.status(500).json({ success: false, message: 'Failed to evaluate answer.' });
  }
});

// @route   GET /api/interview/history
// @desc    Get user interview practice history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const sessions = await InterviewSession.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch interview history.' });
  }
});

module.exports = router;
