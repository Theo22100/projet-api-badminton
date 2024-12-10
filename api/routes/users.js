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
    */
    const { pseudo, password } = req.body;
    // RegExp pour vérifier que le mdp contient au moins 8 caractères, une lettre majuscule, une lettre minuscule et un chiffre
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    try {
        // Vérification de la complexité du mdp
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
