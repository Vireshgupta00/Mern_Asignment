import { Request, Response } from 'express';
import Resume from '../models/Resume';
import { renderTemplate } from '../utils/templates';
import { createClient } from 'redis';

const redisClient = createClient({ url: process.env.REDIS_URI || 'redis://localhost:6379' });
redisClient.connect().catch(console.error);

export const getResumes = async (req: any, res: Response) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id });
    res.json(resumes);
  } catch (error) { res.status(500).json({ error: 'Server error' }); }
};

export const getResumeById = async (req: any, res: Response) => {
  try {
    const cacheKey = `resume:${req.params.id}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) return res.json({ ...JSON.parse(cached), cached: true });

    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.id });
    if (!resume) return res.status(404).json({ error: 'Not found' });
    
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(resume));
    res.json(resume);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const createResume = async (req: any, res: Response) => {
  try {
    const resume = await Resume.create({ ...req.body, userId: req.user.id });
    res.status(201).json(resume);
  } catch (error: any) { 
    res.status(500).json({ error: error.message || 'Failed to create resume' }); 
  }
};

// REQUIRED: AI Generation Flow (Section 6)
export const generateAIResume = async (req: any, res: Response) => {
  try {
    const { personalInfo, experience, templateId } = req.body;

    // Simulate hitting AI Service to generate a structured Professional Summary based on Experience
    // (Mocking this network delay because your OpenAI account is out of credits)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const generatedSummary = `*[AI Generated]* An accomplished professional with extensive experience at ${experience[0]?.company || 'leading organizations'}. Proven track record in delivering high-quality results, optimizing workflows, and driving strategic objectives. Highly skilled in semantic output and modern architectures.`;

    // Render the final HTML using the selected Template Engine (Section 7)
    const htmlOutput = renderTemplate({
      personalInfo,
      experience,
      summary: generatedSummary
    }, templateId);

    res.json({ html: htmlOutput });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate AI resume' });
  }
};