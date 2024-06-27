import { DataTypes } from "sequelize";
import db from "../configs/database.js";
import Report from "./Report.js";

const Evidence = db.define('evidences', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    reportId: {
        type: DataTypes.UUID,
        references: {
            model: 'reports',
            key: 'id'
        },
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
})
Evidence.belongsTo(Report, { foreignKey: 'reportId' });
Report.hasMany(Evidence, { foreignKey: 'reportId' });

export default Evidence