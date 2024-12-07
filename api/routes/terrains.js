const express = require("express");
const { Terrain } = require("../orm");
const router = express.Router();

router.get("/", async (req, res) => {
    const terrains = await Terrain.findAll();
    res.json(terrains);
});

router.put("/:id", async (req, res) => {
    const terrain = await Terrain.findByPk(req.params.id);
    if (terrain) {
        terrain.isAvailable = req.body.isAvailable;
        await terrain.save();
        res.json(terrain);
    } else {
        res.status(404).send("Terrain not found");
    }
});

module.exports = router;
