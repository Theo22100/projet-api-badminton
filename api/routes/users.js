const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const { User } = require('../orm');
const { authenticateToken, isAdmin } = require('../middleware');
const JWT_SECRET = process.env.JWT_SECRET;
const { mapUserResourceObject, mapUserListToRessourceObject, mapLoginResourceObject } = require('../hal');
const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;



// Authentifier un utilisateur
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
        res.status(200).json(mapLoginResourceObject(user, token));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
});

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
            password: 'P4$sw0rd'
        }
    }
    */
    const { pseudo, password } = req.body;
    try {
        if (!pseudo || !password) {
            return res.status(400).json({ error: 'Pseudo et mot de passe sont requis' });
        }
        // Verifier si le pseudo est déjà pris        
        const existingUser = await User.findOne({ where: { pseudo } });
        if (existingUser) {
            return res.status(400).json({ error: 'Le pseudo est déjà utilisé' });
        }

        // Vérifier la longueur du pseudo
        if (pseudo.length < 3 || pseudo.length > 50) {
            return res.status(400).json({
                error: 'Le pseudo doit contenir entre 3 et 50 caractères'
            });
        }
        // Vérifier la longueur du password
        if (password.length < 6 || password.length > 50) {
            return res.status(400).json({
                error: 'Le mot de passe doit contenir au moins 6 caractères et ne doit pas dépasser 50 caractères'
            });
        }        
        // Vérification de la complexité du mdp
        if (!regex.test(password)) {
            return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule et un chiffre' });
        }

        // Création de l'utilisateur
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ pseudo, password: hashedPassword });

        res.status(201).json(mapUserResourceObject(user));
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });

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
            attributes: ['id', 'pseudo', 'createdAt', 'updatedAt'] // Ne pas retourner le mdp
        });
        res.status(200).json(mapUserListToRessourceObject(users));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
    }
});




// Modifier le pseudo d'un utilisateur
router.put('/:id/pseudo', authenticateToken, async (req, res) => {
    /*
    #swagger.tags = ['Users']
    #swagger.summary = 'Modifier le pseudo d\'un utilisateur'
    #swagger.security = [{ BearerAuth: [] }]
    #swagger.description = 'Endpoint permettant de modifier le pseudo d\'un utilisateur en fonction de son ID.'
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        description: 'ID de l\'utilisateur à modifier',
        example: 1
    }
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Pseudo à modifier.',
        required: true,
        schema: {
            pseudo: 'player1'
        }
    }
    */
    const { pseudo } = req.body; 
    const requesterId = req.user.id; 
    try {
        const user = await User.findByPk(req.params.id);
        // Vérifier si l'utilisateur existe
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        // Vérifier permissions
        const isAuthorized = user.id === requesterId || req.user.isAdmin;
        if (!isAuthorized) {
            return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à modifier cet utilisateur' });
        }
        // Vérifier si User existe
        const existingUser = await User.findOne({ where: { pseudo } });
        if (existingUser) {
            return res.status(400).json({ error: 'Le pseudo est déjà utilisé' });
        }

        // Vérifier la longueur du pseudo
        if (pseudo.length < 3 || pseudo.length > 50) {
            return res.status(400).json({
                error: 'Le pseudo doit contenir entre 3 et 50 caractères'
            });
        }

        user.pseudo = pseudo;
        await user.save();
        res.status(200).json(mapUserResourceObject(user));
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la modification du pseudo' });
    }
});

// Modifier le mot de passe d'un utilisateur
router.put('/:id/password', authenticateToken, async (req, res) => {
    /*
    #swagger.tags = ['Users']
    #swagger.summary = 'Modifier le mot de passe d\'un utilisateur'
    #swagger.security = [{ BearerAuth: [] }]
    #swagger.description = 'Endpoint permettant de modifier le mot de passe d\'un utilisateur en fonction de son ID.'
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        description: 'ID de l\'utilisateur à modifier',
        example: 1
    }
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Mot de passe à modifier.',
        required: true,
        schema: {
            password: 'P4$sw0rd'
        }
    }
    */
    const { password } = req.body;
    const requesterId = req.user.id; // Utilisateur qui effectue req
    try {
        // Récupérer l'utilisateur
        const user = await User.findByPk(req.params.id);
        // Vérifier si User existe
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        // Vérifier permissions
        const isAuthorized = user.id === requesterId || req.user.isAdmin;
        if (!isAuthorized) {
            return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à modifier cet utilisateur' });
        }

        //Valider mdp
        if (!regex.test(password)) {
            return res.status(400).json({
                error: 'Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial'
            });
        }
        
        // Vérifier la longueur du password
        if (password.length < 6 || password.length > 50) {
            return res.status(400).json({
                error: 'Le mot de passe doit contenir au moins 6 caractères et ne doit pas dépasser 50 caractères'
            });
        }  

        // MAJ le mot de passe
        user.password = await bcrypt.hash(password, 10);
        await user.save();

        res.status(200).json(mapUserResourceObject(user));
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la modification du mot de passe' });
    }
});


module.exports = router;
