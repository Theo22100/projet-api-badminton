const express = require("express");
const { Terrain } = require("../orm");
const router = express.Router();


router.get("/", async (req, res) => {
    /* 
    #swagger.tags = ['Terrains']
    #swagger.summary = 'Liste tous les terrains'
    #swagger.description = 'Retourne une liste de tous les terrains disponibles dans la base de données.'
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
        res.json(terrains);
    } catch (error) {
        console.error('Error fetching terrains:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des terrains' });
    }
});


router.put("/:id", async (req, res) => {
    /* 
    #swagger.tags = ['Terrains']
    #swagger.summary = 'Met à jour la disponibilité d’un terrain'
    #swagger.description = 'Met à jour le statut de disponibilité d’un terrain donné par son ID.'
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        description: 'ID du terrain à mettre à jour',
        example: 1
    }
    #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        type: 'object',
        schema: {
            isAvailable: { type: 'boolean', example: true }
        }
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
            terrain.isAvailable = req.body.isAvailable;
            await terrain.save();
            res.json(terrain);
        } else {
            res.status(404).json({ error: "Terrain not found" });
        }
    } catch (error) {
        console.error('Error updating terrain:', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour du terrain' });
    }
});

module.exports = router;
