const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database');

const Wilaya = sequelize.define('wilaya', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },

},{
    freezeTableName: true,
    timestamps: false,
});


module.exports = Wilaya;