require('dotenv').config();
const { Sequelize, DataTypes } = require("sequelize");
// const seedInitialData = require('./seeders/seed_initial_data'); 

// Initialisation Sequelize
const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
        host: process.env.DB_HOST || "localhost",
        dialect: "mysql",
        logging: false, // Désactiver logs SQL
    }
);

// Modèle Utilisateur
const User = sequelize.define("User", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    pseudo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { len: [3, 50] }, // Longueur entre 3 et 50 char
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [8, 100] }, // Minimum 8 char
    },
});

// Modèle Terrain
const Terrain = sequelize.define("Terrain", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { len: [1, 10] }, // Longueur entre 1 et 10 char
    },
    isAvailable: { type: DataTypes.BOOLEAN, defaultValue: true },
});

// Modèle Réservation
const Reservation = sequelize.define("Reservation", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    timeSlot: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { 
            is: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, // Format HH:mm
        },
    },
});

// Relations modèles
User.hasMany(Reservation, { foreignKey: "userId", onDelete: "CASCADE" });
Reservation.belongsTo(User, { foreignKey: "userId" });
Terrain.hasMany(Reservation, { foreignKey: "terrainId", onDelete: "CASCADE" });
Reservation.belongsTo(Terrain, { foreignKey: "terrainId" });

// Synchronisation bdd
async function initializeDatabase() {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
}
initializeDatabase(); // tester la connexion

// Export modèles et Sequelize
module.exports = {
    sequelize,
    User,
    Terrain,
    Reservation,
};
