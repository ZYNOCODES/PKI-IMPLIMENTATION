const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database');
const Wilaya = require('./WilayaModel');
const Region = require('./RegionModel');
const Role = require('./RoleModel');

const Profile = sequelize.define('profile', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    fullname:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    username:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    wilaya:{
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'wilaya',
            key: 'id'
        }
    },
    region:{
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'region',
            key: 'id'
        }
    },
    role: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'role',
            key: 'id'
        }
    },
    validation:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
},{
    freezeTableName: true,
    timestamps: false,
});

Profile.belongsTo(Wilaya, {
    foreignKey: 'wilaya',
    as: 'wilayaAssociation'
});
Profile.belongsTo(Region, {
    foreignKey: 'region',
    as: 'regionAssociation'
});
Profile.belongsTo(Role, {
    foreignKey: 'role',
    as: 'roleAssociation'
});


module.exports = Profile;