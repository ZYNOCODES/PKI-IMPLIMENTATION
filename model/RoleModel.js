const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database');

const Role = sequelize.define('role', {
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


module.exports = Role;