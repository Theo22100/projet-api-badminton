require('dotenv').config();
const { Sequelize, DataTypes } = require("sequelize");
const seed_initial_data = require('./seeders/seed_initial_data');

// Initialisation Sequelize
const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
        host: process.env.DB_HOST || "localhost",
        dialect: "mysql",
        logging: false,
    }
);

// Modèle Utilisateur
const User = sequelize.define("User", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    pseudo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { len: [3, 50] },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [6, 100] },
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
});

// Modèle Terrain
const Terrain = sequelize.define("Terrain", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { len: [1, 10] },
    },
    isAvailable: { type: DataTypes.BOOLEAN, defaultValue: true },
});

// Modèle Réservation
const Reservation = sequelize.define("Reservation", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    startTime: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    endTime: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
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
        console.log("Connection to the database has been established successfully.");

        // Synchroniser les modèles avec la BDD
        await sequelize.sync({ force: true }); // MAJ les tables sans suppression
        console.log("Database tables synchronized successfully.");

        // Charger seeders avec modèles
        await seed_initial_data({ User, Terrain, Reservation });
    } catch (error) {
        console.error("Unable to connect to the database or synchronize:", error);
    }
}
initializeDatabase();

// Export modèles et Sequelize
module.exports = {
    sequelize,
    User,
    Terrain,
    Reservation,
};
