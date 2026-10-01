import { Request, Response } from 'express';
import { ChatSession } from '../models/ChatSession';
import { ChatMessage } from '../models/ChatMessage';
import { generateChatResponse } from '../services/llm.service';

export const createSession = async (req: any, res: Response) => {
  try {
    const session = await ChatSession.create({ userId: req.user.userId });
    res.status(201).json(session);
  } catch (error) { res.status(500).json({ error: 'Failed to create session' }); }
};

export const getSession = async (req: any, res: Response) => {
  try {
    const session = await ChatSession.findOne({ _id: req.params.id, userId: req.user.id });
    if (!session) return res.status(404).json({ error: 'Not found' });
    const messages = await ChatMessage.find({ sessionId: session._id }).sort('createdAt');
    res.json({ ...session.toObject(), messages });
  } catch (error) { res.status(500).json({ error: 'Server error' }); }
};

export const getSessions = async (req: any, res: Response) => {
  try {
    const sessions = await ChatSession.find({ userId: req.user.id }).sort('-createdAt');
    res.json(sessions);
  } catch (error) { res.status(500).json({ error: 'Server error' }); }
};

// REQUIRED: Rename Chat Session
export const renameSession = async (req: any, res: Response) => {
  try {
    const session = await ChatSession.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId }, 
      { title: req.body.title }, 
      { new: true }
    );
    res.json(session);
  } catch (error) { res.status(500).json({ error: 'Failed to rename session' }); }
};

// REQUIRED: Delete Chat Session
export const deleteSession = async (req: any, res: Response) => {
  try {
    await ChatSession.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    await ChatMessage.deleteMany({ sessionId: req.params.id });
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: 'Failed to delete session' }); }
};

export const sendMessage = async (req: any, res: Response) => {
  try {
    const { content } = req.body;
    const sessionId = req.params.id;

    // Persist user message
    const userMessage = await ChatMessage.create({ sessionId, role: 'user', content });

    // Retrieve context
    const history = await ChatMessage.find({ sessionId }).sort('createdAt');
    const formattedHistory = history.map(m => ({ role: m.role as 'user'|'assistant'|'system', content: m.content }));

    // Generate response (with retry/timeout tracking)
    const aiResponse: any = await generateChatResponse(formattedHistory);

    // Persist AI message
    const assistantMessage = await ChatMessage.create({ sessionId, role: 'assistant', content: aiResponse.content });

    // BONUS: Update Token Usage Tracking
    if (aiResponse.usage?.total_tokens) {
      await ChatSession.findByIdAndUpdate(sessionId, { $inc: { totalTokensUsed: aiResponse.usage.total_tokens } });
    }

    res.json({ userMessage, assistantMessage });
  } catch (error: any) { res.status(500).json({ error: error.message }); }
};