const express = require('express');
const router = express.Router();
const { User } = require('../orm');

// Créer un utilisateur
router.post('/', async (req, res) => {
    // #swagger.summary = "Page Users"
    const { pseudo, password } = req.body;
    try {
        const user = await User.create({ pseudo, password });
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
