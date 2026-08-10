const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Roadmap = require('../models/Roadmap');
const { generateRoadmap } = require('../services/aiService');

// @route   POST /api/roadmap/generate
// @desc    Generate personalized AI Learning Roadmap
router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const { targetRole, skills, level } = req.body;
    const role = targetRole || req.user.targetRole || 'Full Stack Developer';
    const knownSkills = Array.isArray(skills) ? skills : [];
    const experienceLevel = level || 'Mid Level';

    const aiResult = await generateRoadmap(knownSkills, role, experienceLevel);

    // Save to Database
    let savedRoadmap = null;
    try {
      const roadmapDoc = new Roadmap({
        user: req.user.id,
        targetRole: role,
        currentLevel: experienceLevel,
        durationWeeks: aiResult.durationWeeks || 12,
        stages: aiResult.stages || []
      });
      savedRoadmap = await roadmapDoc.save();
    } catch (dbErr) {
      console.warn('Roadmap DB save skipped:', dbErr.message);
    }

    res.json({
      success: true,
      roadmap: {
        id: savedRoadmap ? savedRoadmap._id : 'temp_rm_' + Date.now(),
        ...aiResult,
        createdAt: new Date()
      }
    });

  } catch (error) {
    console.error('Roadmap Route Error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate roadmap.' });
  }
});

// @route   GET /api/roadmap/user-roadmaps
// @desc    Get all saved user roadmaps
router.get('/user-roadmaps', authMiddleware, async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, roadmaps });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch roadmaps.' });
  }
});

// @route   PUT /api/roadmap/:id/toggle-task
// @desc    Toggle completion of a task node in roadmap
router.put('/:id/toggle-task', authMiddleware, async (req, res) => {
  try {
    const { taskId, completed } = req.body;
    const roadmap = await Roadmap.findOne({ _id: req.params.id, user: req.user.id });

    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'Roadmap not found.' });
    }

    let totalTasks = 0;
    let completedTasks = 0;

    roadmap.stages.forEach(stage => {
      stage.tasks.forEach(task => {
        if (task.id === taskId) {
          task.completed = completed;
        }
        totalTasks++;
        if (task.completed) completedTasks++;
      });
    });

    roadmap.overallProgress = Math.round((completedTasks / totalTasks) * 100);
    await roadmap.save();

    res.json({ success: true, roadmap });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update task progress.' });
  }
});

module.exports = router;
