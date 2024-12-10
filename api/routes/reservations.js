const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Reservation, Terrain } = require('../orm');
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
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Créer une réservation.',
        required: true,
        schema: {
            terrainId: '1',
            date: 'YYYY-MM-DD',
            startTime: 'HH:MM',
        }
    }
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

        // Validation de l'heure de début (format HH:mm)
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        if (!timeRegex.test(startTime)) {
            return res.status(400).json({ error: 'Heure de début invalide (format attendu: HH:mm).' });
        }

        // Vérification que le créneau commence après ou à 10h
        const [startHour, startMinute] = startTime.split(':').map(Number);
        if (startHour < 10) {
            return res.status(400).json({ error: 'Les réservations ne peuvent pas commencer avant 10h.' });
        }

        // Calcul de l'heure de fin
        const endTime = new Date(0, 0, 0, startHour, startMinute + 45).toTimeString().split(' ')[0];

        // Vérification que l'heure de fin ne dépasse pas 22h
        const [endHour, endMinute] = endTime.split(':').map(Number);
        if (endHour > 22 || (endHour === 22 && endMinute > 0)) {
            return res.status(400).json({ error: 'Le créneau doit se terminer avant 22h.' });
        }

        // Vérification de chevauchement avec d'autres réservations
        const overlappingReservation = await Reservation.findOne({
            where: {
                terrainId,
                date,
                [Op.or]: [
                    {
                        startTime: { [Op.lt]: endTime },
                        endTime: { [Op.gt]: startTime },
                    },
                ],
            },
        });

        if (overlappingReservation) {
            return res.status(400).json({ message: 'Créneau déjà réservé pour cette plage horaire.' });
        }

        // Créer la réservation
        const reservation = await Reservation.create({ userId, terrainId, date, startTime, endTime });
        res.status(201).json(mapReservationResourceObject(reservation));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



router.delete('/:id', authenticateToken, async (req, res) => {
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
        const reservation = await Reservation.findByPk(id);
        if (!reservation) {
            return res.status(404).json({ error: 'Réservation non trouvée' });
        }
        if (reservation.userId === idUser || req.user.isAdmin) {
            await reservation.destroy();
            return res.status(204).end();
        } else {
            return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à supprimer cette réservation' });
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
