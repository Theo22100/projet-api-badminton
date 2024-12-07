
const { User, Terrain, Reservation } = require("./orm");

// Liste des réservations
async function getReservations() {
    return await Reservation.findAll({
        include: [User, Terrain],
    });
}

// Ajouter nouvelle reservation
async function addReservation(userId, terrainId, timeSlot) {
    return await Reservation.create({ userId, terrainId, timeSlot });
}

// Liste terrains dispo
async function getAvailableTerrains() {
    return await Terrain.findAll({ where: { isAvailable: true } });
}

// Marquer un terrain comme disponible ou non
async function setTerrainAvailability(terrainId, isAvailable) {
    const terrain = await Terrain.findByPk(terrainId);
    if (terrain) {
        terrain.isAvailable = isAvailable;
        await terrain.save();
    }
    return terrain;
}

module.exports = {
    getReservations,
    addReservation,
    getAvailableTerrains,
    setTerrainAvailability,
};
