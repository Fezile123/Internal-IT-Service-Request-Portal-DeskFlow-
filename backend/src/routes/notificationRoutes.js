const { addSSEClient, removeSSEClient } = require('../services/notificationService');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { prisma } = require('../config/prisma');
const { protect } = require('../middleware/auth');

router.get('/stream', (req, res) => {
  const token = req.query.token;
  if (!token) return res.status(401).end();
  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.id;
  } catch {
    return res.status(401).end();
  }
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.flushHeaders();
  addSSEClient(userId, res);
  const heartbeat = setInterval(() => { res.write(': heartbeat\n\n'); }, 25000);
  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', userId })}\n\n`);
  req.on('close', () => { clearInterval(heartbeat); removeSSEClient(userId); });
});

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 20;
    const skip = parseInt(req.query.skip) || 0;
    const unreadOnly = req.query.unreadOnly === 'true';
    const where = unreadOnly ? { userId, isRead: false } : { userId };
    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({ where, orderBy: { createdAt: 'desc' }, take: limit, skip }),
      prisma.notification.count({ where: { userId, isRead: false } }),
    ]);
    res.json({ notifications, unreadCount });
  } catch (e) {
    console.error('GET /notifications error:', e);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

router.get('/unread-count', async (req, res) => {
  try {
    const count = await prisma.notification.count({ where: { userId: req.user.id, isRead: false } });
    res.json({ count });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
});

router.patch('/mark-all-read', async (req, res) => {
  try {
    await prisma.notification.updateMany({ where: { userId: req.user.id, isRead: false }, data: { isRead: true } });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to mark all as read' });
  }
});

router.patch('/:id/read', async (req, res) => {
  try {
    await prisma.notification.updateMany({ where: { id: req.params.id, userId: req.user.id }, data: { isRead: true } });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to mark as read' });
  }
});

router.delete('/clear-all', async (req, res) => {
  try {
    await prisma.notification.deleteMany({ where: { userId: req.user.id } });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to clear notifications' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.notification.deleteMany({ where: { id: req.params.id, userId: req.user.id } });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

module.exports = router;
