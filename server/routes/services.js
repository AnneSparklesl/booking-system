const express = require('express');
const router = express.Router();
const prisma = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// GET all services (public - anyone can see)
router.get('/', async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      include: { slots: true }
    });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
});

// GET single service
router.get('/:id', async (req, res) => {
  try {
    const service = await prisma.service.findUnique({
      where: { id: req.params.id },
      include: { slots: true }
    });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
});

// CREATE service (admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, duration, price } = req.body;
    const service = await prisma.service.create({
      data: { name, description, duration, price }
    });
    res.status(201).json({ message: 'Service created', service });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
});

// DELETE service (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.service.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
});

module.exports = router;