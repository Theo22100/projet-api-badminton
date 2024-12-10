const bcrypt = require("bcrypt");

module.exports = async function seedInitialData({ User, Terrain, Reservation }) {
    try {
        console.log("Starting seeders...");

        // Vérification et insertion des utilisateurs si nécessaire
        const existingUsers = await User.count();
        if (existingUsers === 0) {
            const hashedPasswordAdmin = await bcrypt.hash("astrongpassword", 10); // Hash pour l'admin
            const hashedPasswordPlayer1 = await bcrypt.hash("password123", 10); // Hash pour player1
            const hashedPasswordPlayer2 = await bcrypt.hash("password456", 10); // Hash pour player2

            await User.bulkCreate([
                { pseudo: "admybad", password: hashedPasswordAdmin, isAdmin: true },
                { pseudo: "player1", password: hashedPasswordPlayer1 },
                { pseudo: "player2", password: hashedPasswordPlayer2 },
            ]);
            console.log("Users seeded.");
        }

        // Vérification et insertion des terrains si nécessaire
        const existingTerrains = await Terrain.count();
        if (existingTerrains === 0) {
            await Terrain.bulkCreate([
                { name: "A" },
                { name: "B", isAvailable: false },
                { name: "C" },
                { name: "D" },
            ]);
            console.log("Terrains seeded.");
        }

        // Vérification et insertion des réservations si nécessaire
        const existingReservations = await Reservation.count();
        if (existingReservations === 0) {
            // Récupération des utilisateurs et terrains
            const user1 = await User.findOne({ where: { pseudo: "player1" } });
            const terrainA = await Terrain.findOne({ where: { name: "A" } });

            if (user1 && terrainA) {
                await Reservation.bulkCreate([
                    {
                        userId: user1.id,
                        terrainId: terrainA.id,
                        date: "2024-12-08", // 8 décembre 2024
                        startTime: "10:00:00",
                        endTime: "10:45:00",
                    },
                ]);
                console.log("Reservations seeded.");
            } else {
                console.error("User or Terrain not found for reservations seeding.");
            }
        }

        console.log("Seeders completed successfully!");
    } catch (error) {
        console.error("Error during seeding:", error);
        throw error;
    }
};
