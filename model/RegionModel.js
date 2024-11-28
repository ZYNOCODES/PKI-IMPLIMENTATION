const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database');

const Region = sequelize.define('region', {
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


module.exports = Region;