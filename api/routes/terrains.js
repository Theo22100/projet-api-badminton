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


module.exports = router;
