const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const authMiddleware = require('../middleware/authMiddleware');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const { analyzeResume } = require('../services/aiService');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// @route   POST /api/resume/analyze
// @desc    Analyze resume text or PDF upload with AI
router.post('/analyze', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    let resumeText = req.body.resumeText || '';
    const targetRole = req.body.targetRole || 'Full Stack Developer';
    const resumeTitle = req.body.resumeTitle || 'My Resume';

    // If PDF file was uploaded
    if (req.file) {
      if (req.file.mimetype === 'application/pdf') {
        const pdfData = await pdfParse(req.file.buffer);
        resumeText = pdfData.text;
      } else {
        resumeText = req.file.buffer.toString('utf-8');
      }
    }

    if (!resumeText || resumeText.trim().length < 20) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid resume text or upload a readable document (minimum 20 characters).'
      });
    }

    const aiResult = await analyzeResume(resumeText, targetRole);

    // Save analysis to Database if Mongoose is connected
    let savedDoc = null;
    try {
      const analysisDoc = new ResumeAnalysis({
        user: req.user.id,
        resumeTitle,
        rawText: resumeText.slice(0, 5000), // Trim raw text storage
        targetRole,
        overallAtsScore: aiResult.overallAtsScore,
        formattingScore: aiResult.formattingScore,
        impactScore: aiResult.impactScore,
        keywordScore: aiResult.keywordScore,
        summary: aiResult.summary,
        strengths: aiResult.strengths,
        improvements: aiResult.improvements,
        missingKeywords: aiResult.missingKeywords,
        extractedSkills: aiResult.extractedSkills,
        softSkills: aiResult.softSkills,
        hardSkills: aiResult.hardSkills,
        sectionAudit: aiResult.sectionAudit
      });
      savedDoc = await analysisDoc.save();
    } catch (dbErr) {
      console.warn('Database save skipped or failed:', dbErr.message);
    }

    res.json({
      success: true,
      analysis: {
        id: savedDoc ? savedDoc._id : 'temp_' + Date.now(),
        ...aiResult,
        targetRole,
        resumeTitle,
        createdAt: new Date()
      }
    });

  } catch (error) {
    console.error('Resume Analysis Route Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze resume. Please try again.'
    });
  }
});

// @route   GET /api/resume/history
// @desc    Get user's past resume analyses
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const history = await ResumeAnalysis.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch resume history.' });
  }
});

// @route   GET /api/resume/:id
// @desc    Get specific resume analysis details
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const analysis = await ResumeAnalysis.findOne({ _id: req.params.id, user: req.user.id });
    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis record not found.' });
    }
    res.json({ success: true, analysis });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch analysis.' });
  }
});

module.exports = router;
