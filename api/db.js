
const { User, Terrain, Reservation } = require("./orm");

// Fetch all reservations
async function getReservations() {
    return await Reservation.findAll({
        include: [User, Terrain],
    });
}

// Add a new reservation
async function addReservation(userId, terrainId, timeSlot) {
    return await Reservation.create({ userId, terrainId, timeSlot });
}

// Fetch available terrains
async function getAvailableTerrains() {
    return await Terrain.findAll({ where: { isAvailable: true } });
}

// Mark a terrain as unavailable
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
