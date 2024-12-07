const { User, Terrain, sequelize } = require("../orm");

module.exports = async function seedInitialData() {
    try {
        console.log("Starting seeders...");
        
        // Synchronisation bdd
        await sequelize.sync({ force: true });

        // Seed des utilisateurs
        await User.bulkCreate([
            { pseudo: "admybad", password: "P4$$w0rd" },
            { pseudo: "player1", password: "password123" },
            { pseudo: "player2", password: "password456" },
        ]);

        // Seed des terrains
        await Terrain.bulkCreate([
            { name: "A" },
            { name: "B", isAvailable: false },
            { name: "C" },
            { name: "D" },
        ]);

        console.log("Seeders completed successfully!");
    } catch (error) {
        console.error("Seeding failed:", error);
        throw error; // Propager l'erreur si nécessaire
    } finally {
        await sequelize.close();
    }
};
