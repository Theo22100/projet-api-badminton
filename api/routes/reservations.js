const express = require('express');
const router = express.Router();
const { Reservation } = require('../orm');
const { authenticateToken, isAdmin } = require('../middleware');
const { mapReservationResourceObject, mapReservationListToRessourceObject } = require('../hal');


router.get('/', async (req, res) => {
    /* 
    #swagger.tags = ['Réservations'] 
    #swagger.summary = 'Liste des réservations'
    #swagger.description = 'Endpoint permettant de lister toutes les réservations.'
    */
    try {
        const reservations = await Reservation.findAll();
        res.status(200).json(mapReservationListToRessourceObject(reservations));
    } catch (err) {
        res.status(400).json({ error: err.message });
    }

});


router.post('/', authenticateToken, async (req, res) => {
    /* 
    #swagger.tags = ['Réservations'] 
    #swagger.summary = 'Créer une réservation'
    #swagger.security = [{ BearerAuth: [] }]
    #swagger.description = 'Endpoint permettant de créer une réservation pour un utilisateur donné et un terrain spécifique à un horaire précis.'
    */
    const { terrainId, date, startTime } = req.body;
    const userId = req.user.id;
    try {
        // Vérification de la fermeture du terrain
        const terrain = await Terrain.findByPk(terrainId);
        if (!terrain || !terrain.isAvailable) {
            return res.status(400).json({ error: 'Terrain non disponible.' });
        }
        // Vérification de la validité de la date
        const reservationDate = new Date(date);
        if (isNaN(reservationDate.getTime())) {
            return res.status(400).json({ error: 'Date invalide (format attendu: YYYY-MM-DD).' });
        }

        // Vérification que la réservation n'est pas un dimanche
        const dayOfWeek = reservationDate.getDay(); // 0: Dimanche, 1: Lundi, ..., 6: Samedi
        if (dayOfWeek === 0) {
            return res.status(400).json({ error: 'Impossible de réserver un dimanche.' });
        }
        // Calcul de l'heure de fin
        const [hour, minute] = startTime.split(':').map(Number);
        const endTime = new Date(0, 0, 0, hour, minute + 45).toTimeString().split(' ')[0];

        // Vérifier la disponibilité
        const existingReservation = await Reservation.findOne({
            where: { terrainId, date, startTime },
        });
        if (existingReservation) {
            return res.status(400).json({ message: 'Créneau déjà réservé.' });
        }

        // Créer la réservation
        const reservation = await Reservation.create({ userId, terrainId, date, startTime, endTime });
        res.status(201).json(mapReservationResourceObject(reservation));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.delete('/:id', authenticateToken,  async (req, res) => {
    /* 
    #swagger.tags = ['Réservations'] 
    #swagger.summary = 'Supprimer une réservation'
    #swagger.security = [{ BearerAuth: [] }]
    #swagger.description = 'Endpoint permettant de supprimer une réservation en fonction de son ID.'
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        description: 'ID de la réservation à supprimer',
        example: 1
    }
    */
    const { id } = req.params;
    // recupere l'id de l'utilisateur connecté 
    const idUser = req.user.id;
    try {
        if (Reservation.userId !== idUser || !req.user.isAdmin) {
            return res.status(403).json({ error: 'Accès refusé' });
        }
        const reservation = await Reservation.findByPk(id);
        if (!reservation) {
            return res.status(404).json({ error: 'Réservation non trouvée' });
        }
        await reservation.destroy();
        res.status(204).end();
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
