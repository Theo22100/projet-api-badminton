const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { User } = require('./orm');
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware d'authentification
const authenticateToken = async (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'Accès refusé : token manquant' });
    }

    try {
        // Vérification et décodage du token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Recherche de l'utilisateur correspondant
        const user = await User.findByPk(decoded.id); // Remplacez par la méthode correspondant à votre ORM
        if (!user) {
            return res.status(403).json({ message: 'Utilisateur non trouvé ou accès interdit' });
        }

        // Ajout des infos utilisateur dans la requête
        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token invalide ou expiré', error: error.message });
    }
};

// Middleware pour vérifier si l'utilisateur est admin
const isAdmin = (req, res, next) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Accès interdit : réservé aux administrateurs' });
    }
    next();
};

module.exports = {
    authenticateToken,
    isAdmin
};
