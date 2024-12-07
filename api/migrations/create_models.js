
const { sequelize } = require("../orm");

(async () => {
    try {
        console.log("Starting migrations...");
        await sequelize.sync({ force: true }); // Recreate database schema
        console.log("Migrations completed successfully!");
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        process.exit();
    }
})();
