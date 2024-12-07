module.exports = async function seedInitialData({ User, Terrain }) {
    try {
        console.log("Starting seeders...");

        // Vérification et insertion des utilisateurs si nécessaire
        const users = await User.findAll();
        if (users.length === 0) {
            await User.bulkCreate([
                { pseudo: "admybad", password: "P4$$w0rd", isAdmin: true},
                { pseudo: "player1", password: "password123" },
                { pseudo: "player2", password: "password456" },
            ]);
        }

        // Vérification et insertion des terrains si nécessaire
        const terrains = await Terrain.findAll();
        if (terrains.length === 0) {
            await Terrain.bulkCreate([
                { name: "A" },
                { name: "B", isAvailable: false },
                { name: "C" },
                { name: "D" },
            ]);
        }

        console.log("Seeders completed successfully!");
    } catch (error) {
        console.error("Error during seeding:", error);
        throw error; 
    }
};
