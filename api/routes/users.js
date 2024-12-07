const express = require('express');
const router = express.Router();
const { User } = require('../orm');


router.post('/', async (req, res) => {
    /* 
    #swagger.tags = ['Users']
    #swagger.summary = 'Créer un utilisateur'
    #swagger.description = 'Endpoint pour créer un nouvel utilisateur'
    #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        type: 'object',
        schema: {
            pseudo: { type: 'string', example: 'player1' },
            password: { type: 'string', example: 'P4$$w0rd' }
        }
    }
    #swagger.responses[201] = {
        description: 'Utilisateur créé avec succès',
        schema: {
            id: 1,
            pseudo: 'player1',
            password: 'P4$$w0rd'
        }
    }
    #swagger.responses[400] = {
        description: 'Erreur lors de la création de l’utilisateur',
        schema: { error: 'Pseudo déjà utilisé' }
    }
    */
    const { pseudo, password } = req.body;
    try {
        const user = await User.create({ pseudo, password });
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
