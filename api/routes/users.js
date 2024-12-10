const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const { User } = require('../orm');
const { authenticateToken, isAdmin } = require('../middleware');
const JWT_SECRET = process.env.JWT_SECRET;
const { mapUserResourceObject, mapUserListToRessourceObject } = require('../hal');





// Créer un utilisateur
router.post('/', async (req, res) => {
    /* 
    #swagger.tags = ['Users']
    #swagger.summary = 'Créer un utilisateur'
    #swagger.description = 'Créer un utilisateur avec un pseudo unique et un mot de passe hashé.'

    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Données pour créer un utilisateur.',
        required: true,
        schema: {
            pseudo: 'player1',
            password: 'P4$$w0rd'
        }
    }

    #swagger.responses[201] = {
        description: 'Utilisateur créé avec succès',
        content: {
            'application/json': {
                schema: {
                    id: { type: 'integer', example: 1 },
                    pseudo: { type: 'string', example: 'player1' },
                    createdAt: { type: 'string', format: 'date-time', example: '2024-01-01T12:00:00.000Z' },
                    updatedAt: { type: 'string', format: 'date-time', example: '2024-01-01T12:00:00.000Z' }
                }
            }
        }
    }

    #swagger.responses[400] = {
        description: 'Erreur : pseudo déjà utilisé ou validation échouée',
        content: {
            'application/json': {
                schema: {
                    error: { type: 'string', example: 'Pseudo déjà utilisé' }
                }6
            }
        }
    }
    */
    const { pseudo, password } = req.body;
    // RegExp simple pour vérifier que le mot de passe contient au moins 8 caractères, une lettre majuscule, une lettre minuscule et un chiffre
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
    try {
        // Vérification de la complexité du mot de passe
        if (!regex.test(password)) {
            return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule et un chiffre' });
        }

        // Création de l'utilisateur
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ pseudo, password: hashedPassword });

        res.status(201).json(mapUserResourceObject(user));
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});








// Liste des utilisateurs
router.get('/', authenticateToken, isAdmin, async (req, res) => {
    /* 
    #swagger.tags = ['Users']
    #swagger.summary = 'Liste des utilisateurs'
    #swagger.security = [{ BearerAuth: [] }]
    #swagger.description = 'Retourne la liste de tous les utilisateurs enregistrés.'
    #swagger.responses[200] = {
        description: 'Liste des utilisateurs récupérée avec succès',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'integer', example: 1 },
                            pseudo: { type: 'string', example: 'player1' },
                            createdAt: { type: 'string', format: 'date-time', example: '2024-01-01T12:00:00.000Z' },
                            updatedAt: { type: 'string', format: 'date-time', example: '2024-01-01T12:00:00.000Z' }
                        }
                    }
                }
            }
        }
    }
    */
    try {
        const users = await User.findAll({
            attributes: ['id', 'pseudo', 'createdAt', 'updatedAt'] // Ne pas retourner le mot de passe
        });
        res.status(200).json(mapUserListToRessourceObject(users));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
    }
});


// Authentifier un utilisateur6
router.post('/login', async (req, res) => {
    /* 
    #swagger.tags = ['Users']
    #swagger.summary = 'Authentifier un utilisateur'
    #swagger.description = 'Endpoint permettant à un utilisateur de se connecter avec son pseudo et son mot de passe.'

    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Données pour se connecter à un utilisateur.',
        required: true,
        schema: {
            pseudo: 'admybad',
            password: 'astrongpassword'
        }
    }
    #swagger.responses[200] = {
        description: 'Connexion réussie',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
                    }
                }
            }
        }
    }
    #swagger.responses[401] = {
        description: 'Pseudo ou mot de passe incorrect',
        content: {
            'application/json': {
                schema: { 
                    type: 'object',
                    properties: {
                        error: { type: 'string', example: 'Pseudo ou mot de passe incorrect' }
                    }
                }
            }
        }
    }
    */
    const { pseudo, password } = req.body;
    try {
        const user = await User.findOne({ where: { pseudo } });
        if (!user) {
            return res.status(401).json({ error: 'Pseudo ou mot de passe incorrect' });
        }

        // Vérification du mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Pseudo ou mot de passe incorrect' });
        }

        // Génération du token JWT
        const token = jwt.sign(
            { id: user.id, pseudo: user.pseudo, isAdmin: user.isAdmin },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        // TODO : renvoyer en hal les informations de l'utilisateur + le token
        res.status(200).json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
});


// Modifier un utilisateur
router.put('/:id', authenticateToken, async (req, res) => {
    /*
    #swagger.tags = ['Users']
    #swagger.summary = 'Modifier un utilisateur'
    #swagger.security = [{ BearerAuth: [] }]
    #swagger.description = 'Endpoint permettant de modifier un utilisateur en fonction de son ID.'
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        description: 'ID de l\'utilisateur à modifier',
        example: 1
    }
    */
    const user = req.user;
    const { pseudo, password } = req.body;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    console.log('>>>>>>>>>> hash password123', await bcrypt.hash('password123', 10));
    console.log('>>>>>>>>>> hash password456', await bcrypt.hash('password456', 10));
    try {
        if (pseudo) user.pseudo = pseudo;
        if (password) {
            if (!regex.test(password)) {
                return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule et un chiffre' });
            }
            user.password = await bcrypt.hash(password, 10);
        }
        await user.save();

        res.status(200).json(mapUserResourceObject(user));	
    } catch (err) {
        res.status(400).json({ error: err.message });
    }

});

module.exports = router;
