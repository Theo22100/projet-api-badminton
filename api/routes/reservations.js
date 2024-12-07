const express = require('express');
const router = express.Router();
const { Reservation } = require('../orm');

// Créer une réservation
router.post('/', async (req, res) => {
    const { userId, terrainId, timeSlot } = req.body;
    try {
        const reservation = await Reservation.create({ userId, terrainId, timeSlot });
        res.status(201).json(reservation);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
