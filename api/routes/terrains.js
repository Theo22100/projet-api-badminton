const express = require("express");
const { Terrain } = require("../orm");
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middleware');
const { mapTerrainResourceObject, mapTerrainListToRessourceObject } = require('../hal');


router.get("/", authenticateToken, async (req, res) => {
    /* 
    #swagger.tags = ['Terrains']
    #swagger.summary = 'Liste tous les terrains'
    #swagger.security = [{ BearerAuth: [] }]
    #swagger.description = 'Retourne une liste de tous les terrains disponibles dans la base de données.'
    #swagger.security = [{ BearerAuth: [] }]
    #swagger.responses[200] = {
        description: 'Liste des terrains',
        schema: [
            {
                id: 1,
                name: 'Terrain A',
                isAvailable: true,
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z'
            }
        ]
    }
    */
    try {
        const terrains = await Terrain.findAll();
        res.status(200).json(mapTerrainListToRessourceObject(terrains));
    } catch (error) {
        console.error('Error fetching terrains:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des terrains' });
    }
});


router.get("/:id", async (req, res) => {
    /* 
    #swagger.tags = ['Terrains']
    #swagger.summary = 'Récupère les informations pour un terrain spécifique'
    #swagger.description = 'Retourne les informations pour un terrain spécifique basé sur son ID.'
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        description: 'ID du terrain à récupérer',
        example: 1
    }
    #swagger.responses[200] = {
        description: 'Informations du terrain',
        schema: {
            id: 1,
            name: 'Terrain A',
            isAvailable: true,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
        }
    }
    #swagger.responses[404] = {
        description: 'Terrain non trouvé',
        schema: { error: 'Terrain not found' }
    }
    */
    try {
        const terrain = await Terrain.findByPk(req.params.id);
        if (terrain) {
            res.status(200).json(mapTerrainResourceObject(terrain));
        } else {
            res.status(404).json({ error: "Terrain not found" });
        }
    } catch (error) {
        console.error('Error fetching terrain:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération du terrain' });
    }
});


router.put("/:id/availability", authenticateToken, isAdmin, async (req, res) => {
    /* 
    #swagger.tags = ['Terrains']
    #swagger.summary = 'Met à jour la disponibilité d’un terrain'
    #swagger.description = 'Met à jour le statut de disponibilité d’un terrain donné par son ID.'
    #swagger.security = [{ BearerAuth: [] }]
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        description: 'ID du terrain à mettre à jour',
        example: 1
    }

    #swagger.responses[200] = {
        description: 'Terrain mis à jour avec succès',
        schema: {
            id: 1,
            name: 'Terrain A',
            isAvailable: true,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
        }
    }
    #swagger.responses[404] = {
        description: 'Terrain non trouvé',
        schema: { error: 'Terrain not found' }
    }
    */
    try {
        const terrain = await Terrain.findByPk(req.params.id);
        if (terrain) {
            if (terrain.isAvailable) {
                terrain.isAvailable = false;
            } else {
                terrain.isAvailable = true;
            }
            await terrain.save();
            res.status(200).json(mapTerrainResourceObject(terrain));
        } else {
            res.status(404).json({ error: "Terrain not found" });
        }
    } catch (error) {
        console.error('Error updating terrain:', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour du terrain' });
    }
});

module.exports = router;
