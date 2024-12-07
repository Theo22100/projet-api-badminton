const { User, Terrain, sequelize } = require("../orm");

(async () => {
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
            { name: "B", isAvailable: false }, // Terrain B indisponible 
            { name: "C" },
            { name: "D" },
        ]);

        console.log("Seeders completed successfully!");
    } catch (error) {
        console.error("Seeding failed:", error);
    } finally {
        await sequelize.close();
        process.exit(); 
    }
})();
