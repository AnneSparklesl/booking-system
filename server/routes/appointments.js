const express = require('express');
const router = express.Router();
const prisma = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// GET all appointments for logged in user
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { userId: req.user.userId },
      include: {
        slot: true,
        user: { select: { name: true, email: true } }
      }
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
});

// GET all appointments (admin only)
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        slot: true,
        user: { select: { name: true, email: true } }
      }
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
});


router.post('/book', authMiddleware, async (req, res) => {
  try {
    const { slotId } = req.body;

    
    const slot = await prisma.timeSlot.findUnique({
      where: { id: slotId }
    });

    if (!slot) return res.status(404).json({ message: 'Slot not found' });
    if (slot.isBooked) return res.status(400).json({ message: 'Slot already booked' });

    // Create appointment and mark slot as booked
    const appointment = await prisma.appointment.create({
      data: {
        userId: req.user.userId,
        slotId
      }
    });

    await prisma.timeSlot.update({
      where: { id: slotId },
      data: { isBooked: true }
    });

    res.status(201).json({ message: 'Appointment booked!', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
});

// CANCEL appointment
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: req.params.id }
    });

    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    // Free up the slot
    await prisma.timeSlot.update({
      where: { id: appointment.slotId },
      data: { isBooked: false }
    });

    await prisma.appointment.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Appointment cancelled' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
});

module.exports = router;