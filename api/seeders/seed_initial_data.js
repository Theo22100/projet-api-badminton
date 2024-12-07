
const { User, Terrain, Reservation, sequelize } = require("../orm");

(async () => {
    try {
        console.log("Starting seeders...");
        await sequelize.sync({ force: true }); // Ensure schema is in place

        // Seed users
        const users = await User.bulkCreate([
            { pseudo: "admybad", password: "P4$$w0rd" },
            { pseudo: "player1", password: "password123" },
            { pseudo: "player2", password: "password456" },
        ]);

        // Seed terrains
        const terrains = await Terrain.bulkCreate([
            { name: "A" },
            { name: "B", isAvailable: false },
            { name: "C" },
            { name: "D" },
        ]);

        console.log("Seeders completed successfully!");
    } catch (error) {
        console.error("Seeding failed:", error);
    } finally {
        process.exit();
    }
})();
