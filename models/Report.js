import { DataTypes } from "sequelize";
import db from "../configs/database.js";
import Evidence from "./Evidence.js";

const Report = db.define('reports', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    userId: {
        type: DataTypes.UUID,
        references: {
            model: 'users',
            key: 'id'
        },
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    detail: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    longitude: {
        type: DataTypes.STRING
    },
    latitude: {
        type: DataTypes.STRING
    },
    // evidence: {
    //     type: DataTypes.UUID,
    //     references: {
    //         model: 'evidences',
    //         key: 'id'
    //     },
    //     allowNull: false,
    //     validate: {
    //         notEmpty: true
    //     }
    // }, 

    category: {
        type: DataTypes.ENUM(['ILLEGAL_PARKING', 'DOUBLE_PARKING', 'OBSTRUCTING_VEHICLE', 'FACILITY_DAMAGE', 'OTHER']),
        allowNull: false
    },

    status: {
        type: DataTypes.ENUM('OPEN', 'PROCESSED', 'RESOLVED', 'REJECTED'),
        defaultValue: 'OPEN'
    },
    lisencePlate: {
        type: DataTypes.STRING
    },
    lisencePlateExpiry: {
        type: DataTypes.DATE
    }
}, {
    // classMethods: {
    //     associate: function (models) {
    //         Report.hasMany(models.evidences, { foreignKey: 'reportId' });
    //     }
    // }
})

// Report.belongsTo(User, { foreignKey: 'userId' });
// User.hasMany(Report, { foreignKey: 'userId' });

export default Report