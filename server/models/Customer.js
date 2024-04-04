const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Customer extends Model { }

Customer.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        tier: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '',
        },
        notes: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '',
        },
        equipment: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '',
        },
        signDate: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
        },
        nextServiceDate: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: new Date('2000-01-01'),
        },
        lastServiceDate: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: new Date('2000-01-01'),
        },
        lastEmailSent: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: new Date('2000-01-01'),
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '',
        },
        numUnits: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'customer',
    }
);

module.exports = Customer;