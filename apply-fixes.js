const fs = require('fs');

// 1. Add Rate Limiting to AI Service
let aiIndex = fs.readFileSync('./apps/ai-service/src/index.ts', 'utf8');
if (!aiIndex.includes('express-rate-limit')) {
  aiIndex = "import rateLimit from 'express-rate-limit';\n" + aiIndex;
  aiIndex = aiIndex.replace("app.use('/api/ai', chatRoutes);", "const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });\napp.use('/api/ai', limiter, chatRoutes);");
  fs.writeFileSync('./apps/ai-service/src/index.ts', aiIndex);
}

// 2. Add Booking Validation (No past dates)
let bc = fs.readFileSync('./apps/booking-service/src/controllers/booking.controller.ts', 'utf8');
if (!bc.includes('book in the past')) {
  bc = bc.replace("const { consultantId, date, timeSlot } = req.body;", "const { consultantId, date, timeSlot } = req.body;\n    if (new Date(date) < new Date(new Date().setHours(0,0,0,0))) return res.status(400).json({ error: 'Cannot book in the past' });");
  fs.writeFileSync('./apps/booking-service/src/controllers/booking.controller.ts', bc);
}

// 3. Add Missing Resume Schema Fields
let rc = fs.readFileSync('./apps/resume-service/src/models/Resume.ts', 'utf8');
if (!rc.includes('projects')) {
  rc = rc.replace("skills: [String]", "skills: [String],\n    projects: [{ title: String, description: String }],\n    certifications: [String],\n    achievements: [String]");
  fs.writeFileSync('./apps/resume-service/src/models/Resume.ts', rc);
}
