const express = require('express');
const router = express.Router();
const { Reservation } = require('../orm');


router.post('/', async (req, res) => {
    /* 
    #swagger.tags = ['Réservations'] 
    #swagger.summary = 'Créer une réservation'
    #swagger.description = 'Endpoint permettant de créer une réservation pour un utilisateur donné et un terrain spécifique à un horaire précis.'
    #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        description: 'Les informations nécessaires pour créer une réservation.',
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'integer', example: 1 },
                terrainId: { type: 'integer', example: 2 },
                timeSlot: { 
                    type: 'string', 
                    description: 'Horaire au format HH:mm',
                    example: '14:30' 
                }
            },
            required: ['userId', 'terrainId', 'timeSlot']
        }
    }
    #swagger.responses[201] = {
        description: 'Réservation créée avec succès',
        schema: {
            id: 1,
            userId: 1,
            terrainId: 2,
            timeSlot: '14:30',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
        }
    }
    #swagger.responses[400] = {
        description: 'Erreur lors de la création de la réservation',
        schema: { error: 'Message de l\'erreur' }
    }
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
