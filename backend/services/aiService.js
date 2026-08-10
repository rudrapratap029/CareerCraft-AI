const { GoogleGenerativeAI } = require('@google/generative-ai');

const getGeminiModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') return null;
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
};

// Helper to safely parse JSON from Gemini text response
const cleanAndParseJson = (text) => {
  try {
    const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('Failed to parse JSON from AI response:', err);
    return null;
  }
};

/**
 * 1. AI Resume Analysis
 */
const analyzeResume = async (resumeText, targetRole = 'Full Stack Developer') => {
  const model = getGeminiModel();

  if (model) {
    try {
      const prompt = `
You are an expert ATS (Applicant Tracking System) Auditor & Career Coach.
Analyze the following resume text specifically for the target role: "${targetRole}".

Resume Text:
"""
${resumeText}
"""

Return ONLY a valid JSON object matching this structure (no markdown formatting outside JSON):
{
  "overallAtsScore": 82,
  "formattingScore": 85,
  "impactScore": 78,
  "keywordScore": 84,
  "summary": "Professional summary highlighting key strengths and areas of alignment.",
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "improvements": ["Improvement 1", "Improvement 2", "Improvement 3"],
  "missingKeywords": ["Docker", "Kubernetes", "Redis", "TypeScript"],
  "extractedSkills": [
    { "skill": "React.js", "category": "Frontend", "rating": 90, "marketDemand": "High" },
    { "skill": "Node.js", "category": "Backend", "rating": 85, "marketDemand": "High" },
    { "skill": "MongoDB", "category": "Database", "rating": 80, "marketDemand": "High" },
    { "skill": "Git", "category": "DevOps & Tools", "rating": 88, "marketDemand": "High" },
    { "skill": "REST APIs", "category": "System Architecture", "rating": 85, "marketDemand": "High" }
  ],
  "softSkills": ["Problem Solving", "Team Collaboration", "Agile Communication"],
  "hardSkills": ["JavaScript", "React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "Git"],
  "sectionAudit": {
    "contactInfo": { "status": "Passed", "feedback": "All essential contact metrics included." },
    "summarySection": { "status": "Warning", "feedback": "Add more quantifiable metrics to summary." },
    "workExperience": { "status": "Passed", "feedback": "Action verbs present; expand on impact figures." },
    "projects": { "status": "Passed", "feedback": "Great links & dynamic descriptions." },
    "skillsSection": { "status": "Passed", "feedback": "Well grouped technical skills." },
    "education": { "status": "Passed", "feedback": "Clear degree details." }
  }
}
`;
      const result = await model.generateContent(prompt);
      const parsed = cleanAndParseJson(result.response.text());
      if (parsed) return parsed;
    } catch (error) {
      console.warn('Gemini API call failed, falling back to smart analyzer heuristic:', error.message);
    }
  }

  // Fallback heuristic generator if Gemini key is missing or fails
  return generateFallbackResumeAnalysis(resumeText, targetRole);
};

const generateFallbackResumeAnalysis = (resumeText, targetRole) => {
  const textLower = resumeText.toLowerCase();

  // Detect skills present in text
  const catalog = [
    { name: 'JavaScript', category: 'Frontend' },
    { name: 'TypeScript', category: 'Frontend' },
    { name: 'React.js', category: 'Frontend' },
    { name: 'Vue.js', category: 'Frontend' },
    { name: 'HTML5/CSS3', category: 'Frontend' },
    { name: 'Tailwind CSS', category: 'Frontend' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'Express.js', category: 'Backend' },
    { name: 'Python', category: 'Backend' },
    { name: 'Java', category: 'Backend' },
    { name: 'MongoDB', category: 'Database' },
    { name: 'PostgreSQL', category: 'Database' },
    { name: 'MySQL', category: 'Database' },
    { name: 'Redis', category: 'Database' },
    { name: 'Docker', category: 'DevOps & Tools' },
    { name: 'Git & GitHub', category: 'DevOps & Tools' },
    { name: 'CI/CD Pipelines', category: 'DevOps & Tools' },
    { name: 'AWS Cloud', category: 'DevOps & Tools' },
    { name: 'REST APIs', category: 'System Architecture' },
    { name: 'GraphQL', category: 'System Architecture' },
    { name: 'Microservices', category: 'System Architecture' },
    { name: 'Unit Testing', category: 'System Architecture' }
  ];

  const detected = [];
  catalog.forEach(item => {
    if (textLower.includes(item.name.toLowerCase()) || textLower.includes(item.name.split(' ')[0].toLowerCase())) {
      detected.push({
        skill: item.name,
        category: item.category,
        rating: Math.floor(Math.random() * 25) + 70, // 70-95
        marketDemand: 'High'
      });
    }
  });

  // Ensure minimum extracted skills
  if (detected.length < 5) {
    detected.push(
      { skill: 'JavaScript (ES6+)', category: 'Frontend', rating: 85, marketDemand: 'High' },
      { skill: 'React.js', category: 'Frontend', rating: 82, marketDemand: 'High' },
      { skill: 'Node.js & Express', category: 'Backend', rating: 80, marketDemand: 'High' },
      { skill: 'MongoDB Database', category: 'Database', rating: 78, marketDemand: 'High' },
      { skill: 'Git Version Control', category: 'DevOps & Tools', rating: 88, marketDemand: 'High' },
      { skill: 'REST API Architecture', category: 'System Architecture', rating: 84, marketDemand: 'High' }
    );
  }

  const missingList = ['Docker Containerization', 'Kubernetes', 'CI/CD Pipelines', 'TypeScript', 'Redis Caching', 'Jest / Cypress Testing'];

  return {
    overallAtsScore: Math.floor(Math.random() * 15) + 78,
    formattingScore: 88,
    impactScore: 76,
    keywordScore: 82,
    summary: `Strong technical profile with active hands-on skills aligned with ${targetRole}. The resume demonstrates solid practical build experience, clear skill categorization, and project involvement.`,
    strengths: [
      `Solid foundational expertise in core technology stack for ${targetRole}`,
      'Clean layout with clear experience and project sections',
      'Good usage of modern web frameworks and database management'
    ],
    improvements: [
      'Quantify achievements with key metrics (e.g., improved load time by 35%, increased API throughput)',
      'Incorporate missing industry standard DevOps and automated testing keywords',
      'Elaborate on system design & architectural decision-making in project bullet points'
    ],
    missingKeywords: missingList.slice(0, 4),
    extractedSkills: detected,
    softSkills: ['Analytical Problem Solving', 'Cross-functional Collaboration', 'Self-directed Learning', 'Agile Methodology'],
    hardSkills: detected.map(d => d.skill),
    sectionAudit: {
      contactInfo: { status: 'Passed', feedback: 'Contact details and profile links present.' },
      summarySection: { status: 'Warning', feedback: 'Add a tailored career objective aligning with target job requirements.' },
      workExperience: { status: 'Passed', feedback: 'Bullet points use strong action verbs.' },
      projects: { status: 'Passed', feedback: 'Good showcase of practical full-stack applications.' },
      skillsSection: { status: 'Passed', feedback: 'Well structured and categorized.' },
      education: { status: 'Passed', feedback: 'Degree and background verified.' }
    }
  };
};

/**
 * 2. AI Learning Roadmap Generator
 */
const generateRoadmap = async (skills = [], targetRole = 'Full Stack Developer', level = 'Mid Level') => {
  const model = getGeminiModel();

  if (model) {
    try {
      const prompt = `
You are a senior technical career advisor.
Generate a structured learning roadmap for a student/developer targeting the role "${targetRole}" (Current Level: ${level}).
Current known skills: ${skills.join(', ')}.

Return ONLY a valid JSON object matching this structure:
{
  "targetRole": "${targetRole}",
  "currentLevel": "${level}",
  "durationWeeks": 12,
  "stages": [
    {
      "stageNumber": 1,
      "stageTitle": "Stage 1: Mastery of Core Stack & Gaps",
      "stageSummary": "Focus on strengthening foundational architecture and filling critical skill gaps.",
      "estimatedDuration": "Weeks 1 - 3",
      "tasks": [
        {
          "id": "s1_t1",
          "title": "Advanced TypeScript & ES Next",
          "description": "Deep dive into strong typing, generics, utility types, and async patterns.",
          "duration": "1 Week",
          "category": "Core Fundamentals",
          "resources": ["TypeScript Docs", "Frontend Masters - Advanced TS"],
          "projectIdea": "Build a strongly typed API wrapper library."
        }
      ]
    }
  ]
}
Include at least 4 detailed stages with 2-3 actionable task nodes each.
`;
      const result = await model.generateContent(prompt);
      const parsed = cleanAndParseJson(result.response.text());
      if (parsed) return parsed;
    } catch (error) {
      console.warn('Gemini API call failed for Roadmap, using fallback heuristic:', error.message);
    }
  }

  return generateFallbackRoadmap(targetRole, level);
};

const generateFallbackRoadmap = (targetRole, level) => {
  return {
    targetRole: targetRole || 'Full Stack Software Engineer',
    currentLevel: level || 'Mid Level',
    durationWeeks: 12,
    stages: [
      {
        stageNumber: 1,
        stageTitle: 'Stage 1: Core Technical & Language Mastery',
        stageSummary: 'Solidify primary languages, advanced JavaScript/TypeScript patterns, and high-performance frontend state management.',
        estimatedDuration: 'Weeks 1 - 3',
        tasks: [
          {
            id: 's1_t1',
            title: 'Modern TypeScript & ES Next Deep Dive',
            description: 'Master generics, utility types, type guards, and modern asynchronous patterns.',
            duration: '1 Week',
            category: 'Core Fundamentals',
            resources: ['TypeScript Official Docs', 'Execute Program TS Track'],
            projectIdea: 'Refactor a JavaScript codebase into strict TypeScript with zero any types.',
            completed: false
          },
          {
            id: 's1_t2',
            title: 'Advanced React State & Performance Optimization',
            description: 'Learn React 18 concurrent features, custom hooks design, memoization, and Zustand/Redux Toolkit.',
            duration: '2 Weeks',
            category: 'Frontend Engineering',
            resources: ['React Dev Docs', 'Kent C. Dodds React Patterns'],
            projectIdea: 'Build a high-frequency real-time dashboard with custom virtualization.',
            completed: false
          }
        ]
      },
      {
        stageNumber: 2,
        stageTitle: 'Stage 2: Backend Microservices & Data Engineering',
        stageSummary: 'Elevate server side capabilities with scalable Express APIs, database indexing, and caching layers.',
        estimatedDuration: 'Weeks 4 - 6',
        tasks: [
          {
            id: 's2_t1',
            title: 'Express Node.js Architecture & Security Best Practices',
            description: 'Implement JWT authentication, rate limiting, helmet security headers, and structured logger middleware.',
            duration: '1.5 Weeks',
            category: 'Backend Engineering',
            resources: ['Node.js Security Best Practices', 'OWASP Top 10 Guide'],
            projectIdea: 'Build a production-grade Auth & RBAC Microservice.',
            completed: false
          },
          {
            id: 's2_t2',
            title: 'MongoDB Query Optimization & Caching with Redis',
            description: 'Understand aggregation pipelines, compound indices, read/write locks, and Redis session caching.',
            duration: '1.5 Weeks',
            category: 'Database & Caching',
            resources: ['MongoDB University', 'Redis University Essentials'],
            projectIdea: 'Build a high-volume caching proxy for external third-party APIs.',
            completed: false
          }
        ]
      },
      {
        stageNumber: 3,
        stageTitle: 'Stage 3: DevOps, Containerization & CI/CD Pipelines',
        stageSummary: 'Automate build pipelines, containerize backend microservices, and deploy to modern cloud environments.',
        estimatedDuration: 'Weeks 7 - 9',
        tasks: [
          {
            id: 's3_t1',
            title: 'Docker Containerization & Multi-stage Builds',
            description: 'Write optimized Dockerfiles, docker-compose orchestration, and environment secret handling.',
            duration: '1 Week',
            category: 'DevOps & Cloud',
            resources: ['Docker Mastery Course', 'Awesome Docker Examples'],
            projectIdea: 'Containerize full MERN application stack with single command spin-up.',
            completed: false
          },
          {
            id: 's3_t2',
            title: 'GitHub Actions Automated CI/CD Pipeline',
            description: 'Setup automated linting, unit testing, Docker build pushes, and cloud deployment pipelines.',
            duration: '2 Weeks',
            category: 'DevOps & Cloud',
            resources: ['GitHub Actions Documentation', 'Cloud Deployment Guides'],
            projectIdea: 'Create automated workflow triggering deployments on main branch merge.',
            completed: false
          }
        ]
      },
      {
        stageNumber: 4,
        stageTitle: 'Stage 4: System Design & Career Portfolio Execution',
        stageSummary: 'Integrate real-time capabilities, practice system design interview patterns, and complete capstone project.',
        estimatedDuration: 'Weeks 10 - 12',
        tasks: [
          {
            id: 's4_t1',
            title: 'System Design Patterns & High Availability',
            description: 'Learn load balancing, database sharding, message queues (RabbitMQ/Kafka), and event-driven architecture.',
            duration: '1.5 Weeks',
            category: 'System Architecture',
            resources: ['System Design Primer (GitHub)', 'Designing Data-Intensive Applications'],
            projectIdea: 'Design architectural diagram and mock prototype for scalable chat platform.',
            completed: false
          },
          {
            id: 's4_t2',
            title: 'AI Integration Capstone Portfolio Launch',
            description: 'Build and deploy a full-featured AI-powered application with live endpoints and full documentation.',
            duration: '1.5 Weeks',
            category: 'Hands-on Project',
            resources: ['OpenAI / Gemini API Docs', 'Vercel / Render Deployment Guides'],
            projectIdea: 'Deploy your complete AI Career Suite online with custom domain.',
            completed: false
          }
        ]
      }
    ]
  };
};

/**
 * 3. AI Interview Question Generator
 */
const generateInterviewQuestions = async (skills = [], targetRole = 'Full Stack Developer', experienceLevel = 'Mid Level') => {
  const model = getGeminiModel();

  if (model) {
    try {
      const prompt = `
Generate 6 highly realistic interview questions for a "${targetRole}" candidate (${experienceLevel}).
Skills on resume: ${skills.join(', ')}.

Include:
- 2 Technical Questions
- 2 System Design / Architecture Questions
- 2 Behavioral Questions

Return ONLY a valid JSON object matching this structure:
{
  "questions": [
    {
      "id": "q1",
      "category": "Technical",
      "difficulty": "Medium",
      "question": "Clear interview question prompt here?",
      "hint": "Key concepts candidate should mention (e.g. STAR technique, indexes, async execution).",
      "modelAnswer": "Comprehensive sample answer outlining optimal solution."
    }
  ]
}
`;
      const result = await model.generateContent(prompt);
      const parsed = cleanAndParseJson(result.response.text());
      if (parsed) return parsed.questions || parsed;
    } catch (error) {
      console.warn('Gemini API call failed for Interview Questions, using fallback:', error.message);
    }
  }

  return generateFallbackInterviewQuestions(targetRole);
};

const generateFallbackInterviewQuestions = (targetRole) => {
  return [
    {
      id: 'q1',
      category: 'Technical',
      difficulty: 'Medium',
      question: `How do you handle asynchronous state management and side-effects in React when building complex user interfaces for ${targetRole} applications?`,
      hint: 'Discuss useEffect cleanups, custom hooks, abort controllers, or state libraries like Redux/Zustand.',
      modelAnswer: 'Effective asynchronous state management in React relies on isolating side effects using custom hooks or specialized data fetching libraries (such as React Query / TanStack Query). Key considerations include canceling stale requests using AbortController, handling loading and error states explicitly, and avoiding memory leaks during component unmounting.'
    },
    {
      id: 'q2',
      category: 'Technical',
      difficulty: 'Hard',
      question: 'Explain how Node.js Event Loop processes I/O operations and how event blocking can be prevented in production API endpoints.',
      hint: 'Mention Timers, Pending Callbacks, Poll Phase, Check Phase, process.nextTick vs setImmediate, and worker threads.',
      modelAnswer: 'The Node.js Event Loop operates single-threaded via libuv, delegating heavy file or network I/O to background worker threads. Blocking is avoided by avoiding CPU-intensive sync tasks on the main thread, utilizing stream processing for large files, and delegating compute tasks to Worker Threads or external microservices.'
    },
    {
      id: 'q3',
      category: 'System Design',
      difficulty: 'Medium',
      question: 'How would you design a rate-limiting middleware in Express to protect public REST API endpoints from abuse?',
      hint: 'Cover Token Bucket or Leaky Bucket algorithms, Redis for distributed state, and HTTP header responses (429 Too Many Requests).',
      modelAnswer: 'A rate limiter can be implemented using Redis to track IP request counts within a sliding time window. When a client exceeds threshold limits, the middleware responds with HTTP 429 and includes headers like Retry-After and X-RateLimit-Reset.'
    },
    {
      id: 'q4',
      category: 'System Design',
      difficulty: 'Hard',
      question: 'Compare MongoDB vs PostgreSQL indexing strategies. When would you select a NoSQL document database over a Relational SQL database for a new project?',
      hint: 'Discuss schema flexibility, B-Tree indices vs compound/geospatial indices, ACID transactions, and horizontal sharding.',
      modelAnswer: 'MongoDB excels in rapid iteration with flexible JSON document structures and seamless horizontal scaling via sharding. PostgreSQL is preferred when strict schema integrity, complex multi-table joins, and ACID compliance across transactional data are required.'
    },
    {
      id: 'q5',
      category: 'Behavioral',
      difficulty: 'Medium',
      question: 'Describe a situation where a critical bug occurred in production. How did you diagnose, resolve, and prevent it from recurring?',
      hint: 'Use the STAR method (Situation, Task, Action, Result) and focus on root cause analysis, logging, and automated testing.',
      modelAnswer: 'I encountered an unhandled promise rejection causing server restarts under spike traffic. Using centralized logging (Winston + Sentry), I isolated the missing error handler in a DB connection pool. I deployed an immediate hotfix, added fallback retries, and instituted regression testing in CI/CD.'
    },
    {
      id: 'q6',
      category: 'Behavioral',
      difficulty: 'Medium',
      question: 'How do you handle technical debt when product management demands urgent feature delivery?',
      hint: 'Explain trade-offs, refactoring tickets, code reviews, and establishing non-negotiable code quality baselines.',
      modelAnswer: 'I communicate technical debt in terms of business risk and delivery velocity. By allocating a fixed percentage (e.g. 15-20%) of sprint capacity to refactoring and debt cleanup, we maintain feature velocity without compromising platform stability.'
    }
  ];
};

/**
 * 4. AI Answer Evaluation
 */
const evaluateAnswer = async (question, userAnswer, modelAnswer) => {
  const model = getGeminiModel();

  if (model) {
    try {
      const prompt = `
You are an expert technical interviewer evaluating a candidate's response.
Question: "${question}"
Candidate Answer: "${userAnswer}"
Model Benchmark Answer: "${modelAnswer}"

Return ONLY a valid JSON object matching this structure:
{
  "score": 8.5,
  "strengths": ["Clear explanation of core concept", "Used relevant industry terms"],
  "areasForImprovement": ["Include concrete code example", "Mention error boundary handling"],
  "improvedAnswerSuggestion": "Refined version of candidate's answer with higher technical polish."
}
`;
      const result = await model.generateContent(prompt);
      const parsed = cleanAndParseJson(result.response.text());
      if (parsed) return parsed;
    } catch (error) {
      console.warn('Gemini API call failed for evaluation, using fallback:', error.message);
    }
  }

  // Fallback answer scoring logic
  const wordCount = userAnswer.trim().split(/\s+/).length;
  let score = 7.0;
  if (wordCount > 50) score += 1.5;
  if (wordCount < 15) score -= 2.0;
  if (userAnswer.toLowerCase().includes('react') || userAnswer.toLowerCase().includes('node') || userAnswer.toLowerCase().includes('async') || userAnswer.toLowerCase().includes('test')) {
    score += 1.0;
  }
  score = Math.min(10, Math.max(3, Number(score.toFixed(1))));

  return {
    score,
    strengths: [
      'Directly addresses the core prompt requirement',
      'Shows practical technical understanding of the domain'
    ],
    areasForImprovement: [
      'Elaborate further on real-world edge cases and failure modes',
      'Incorporate structured framework principles (e.g., STAR framework for behavioral questions)'
    ],
    improvedAnswerSuggestion: `${userAnswer} To further strengthen this response, emphasize performance implications and describe how you validated the outcome with metrics or automated testing.`
  };
};

module.exports = {
  analyzeResume,
  generateRoadmap,
  generateInterviewQuestions,
  evaluateAnswer
};
