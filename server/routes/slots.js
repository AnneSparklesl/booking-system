const express = require('express');
const router = express.Router();
const prisma = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// GET available slots for a service
router.get('/:serviceId', async (req, res) => {
  try {
    const slots = await prisma.timeSlot.findMany({
      where: {
        serviceId: req.params.serviceId,
        isBooked: false
      }
    });
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
});

// CREATE a single time slot (admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { serviceId, date, time } = req.body;
    const slot = await prisma.timeSlot.create({
      data: { serviceId, date, time }
    });
    res.status(201).json({ message: 'Slot created', slot });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
});

// AUTO-GENERATE slots for a service (admin only)
router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const { serviceId, startDate, endDate, startHour, endHour } = req.body;

    // Get service to know duration
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const duration = service.duration; // in minutes
    const slots = [];

    // Loop through each day in the date range
    let current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
      // Skip weekends (0 = Sunday, 6 = Saturday)
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // Loop through each time slot in the day
        let hour = parseInt(startHour);
        const endHourInt = parseInt(endHour);

        while (hour + duration / 60 <= endHourInt) {
          const timeString = `${String(hour).padStart(2, '0')}:00`;
          const dateString = current.toISOString().split('T')[0];

          // Check if slot already exists
          const existing = await prisma.timeSlot.findFirst({
            where: { serviceId, date: dateString, time: timeString }
          });

          if (!existing) {
            slots.push({ serviceId, date: dateString, time: timeString });
          }

          hour += duration / 60;
        }
      }

      // Move to next day
      current.setDate(current.getDate() + 1);
    }

    // Create all slots at once
    await prisma.timeSlot.createMany({ data: slots });

    res.status(201).json({
      message: `Generated ${slots.length} slots successfully!`,
      count: slots.length
    });

  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
});

// DELETE a slot (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.timeSlot.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Slot deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
});

module.exports = router;