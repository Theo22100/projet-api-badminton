module.exports = async function seedInitialData({ User, Terrain, Reservation }) {
    try {
        console.log("Starting seeders...");

        // Vérification et insertion des utilisateurs si nécessaire
        const users = await User.findAll();
        if (users.length === 0) {
            await User.bulkCreate([
                { pseudo: "admybad", password: "astrongpassword", isAdmin: true},
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

        const reservations = await Reservation.findAll();
        if (reservations.length === 0) {
            // Récupération des utilisateurs et terrains
            const user1 = await User.findOne({ where: { pseudo: "player1" } });
            const terrainA = await Terrain.findOne({ where: { name: "A" } });

            // Création de réservations
            await Reservation.bulkCreate([
                { userId: user1.id, terrainId: terrainA.id, timeSlot: "2022-01-01 10:00:00" },
            ]);
        }

        console.log("Seeders completed successfully!");
    } catch (error) {
        console.error("Error during seeding:", error);
        throw error; 
    }
};
