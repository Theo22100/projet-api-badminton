require('dotenv').config();
const { Sequelize, DataTypes } = require("sequelize");

// Initialisation de Sequelize
const sequelize = new Sequelize("mydb", "user", "password", {
    host: "db",
    dialect: "mysql",
    logging: false, 
});

// Modèle Utilisateur
const User = sequelize.define("User", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    c: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
});

// Modèle Terrain
const Terrain = sequelize.define("Terrain", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    isAvailable: { type: DataTypes.BOOLEAN, defaultValue: true },
});

// Modèle Réservation
const Reservation = sequelize.define("Reservation", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    timeSlot: { type: DataTypes.STRING, allowNull: false },
});

// Relations
User.hasMany(Reservation);
Reservation.belongsTo(User);
Terrain.hasMany(Reservation);
Reservation.belongsTo(Terrain);

module.exports = { sequelize, User, Terrain, Reservation };
