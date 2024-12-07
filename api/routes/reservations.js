const express = require('express');
const router = express.Router();
const { Reservation } = require('../orm');


router.post('/', async (req, res) => {
    /* 
    #swagger.tags = ['Réservations'] 
    #swagger.summary = 'Créer une réservation'
    #swagger.description = 'Endpoint permettant de créer une réservation pour un utilisateur donné et un terrain spécifique à un horaire précis.'
    */
    const { userId, terrainId, timeSlot } = req.body;
    try {
        const reservation = await Reservation.create({ userId, terrainId, timeSlot });
        res.status(201).json(reservation);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
