const fs = require('fs');

// 1. Add GET /ai/sessions/:id to ai-service
let chatController = fs.readFileSync('./apps/ai-service/src/controllers/chat.controller.ts', 'utf8');
if (!chatController.includes('getSession =')) {
  chatController += `\nexport const getSession = async (req: any, res: any) => {
    try {
      const session = await ChatSession.findOne({ _id: req.params.id, userId: req.user.userId }).populate('messages');
      if (!session) return res.status(404).json({ error: 'Session not found' });
      res.json(session);
    } catch (e) {
      res.status(500).json({ error: 'Server error' });
    }
  };`;
  fs.writeFileSync('./apps/ai-service/src/controllers/chat.controller.ts', chatController);
}

let aiRoutes = fs.readFileSync('./apps/ai-service/src/routes/chat.routes.ts', 'utf8');
if (!aiRoutes.includes('getSession')) {
  aiRoutes = aiRoutes.replace('createSession, sendMessage }', 'createSession, sendMessage, getSession }');
  aiRoutes += `\nrouter.get('/sessions/:id', requireAuth, getSession);`;
  fs.writeFileSync('./apps/ai-service/src/routes/chat.routes.ts', aiRoutes);
}

// 2. Add GET /resume/:id to resume-service with REDIS CACHING
let resumeController = fs.readFileSync('./apps/resume-service/src/controllers/resume.controller.ts', 'utf8');
if (!resumeController.includes('getResumeById =')) {
  // Add Redis import
  resumeController = `import { createClient } from 'redis';\nconst redisClient = createClient({ url: process.env.REDIS_URI || 'redis://localhost:6379' });\nredisClient.connect().catch(console.error);\n\n` + resumeController;
  
  resumeController += `\nexport const getResumeById = async (req: any, res: any) => {
    try {
      const cacheKey = \`resume:\${req.params.id}\`;
      const cached = await redisClient.get(cacheKey);
      if (cached) return res.json({ ...JSON.parse(cached), cached: true });

      const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.userId });
      if (!resume) return res.status(404).json({ error: 'Not found' });
      
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(resume)); // Cache for 1 hour
      res.json(resume);
    } catch (e) {
      res.status(500).json({ error: 'Server error' });
    }
  };`;
  fs.writeFileSync('./apps/resume-service/src/controllers/resume.controller.ts', resumeController);
}

let resumeRoutes = fs.readFileSync('./apps/resume-service/src/routes/resume.routes.ts', 'utf8');
if (!resumeRoutes.includes('getResumeById')) {
  resumeRoutes = resumeRoutes.replace('getResumes, createResume }', 'getResumes, createResume, getResumeById }');
  resumeRoutes += `\nrouter.get('/:id', requireAuth, getResumeById);`;
  fs.writeFileSync('./apps/resume-service/src/routes/resume.routes.ts', resumeRoutes);
}
