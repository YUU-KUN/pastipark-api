import { DataTypes } from "sequelize";
import db from "../configs/database.js";

const User = db.define('users', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  role: {
    type: DataTypes.ENUM('USER', 'DISHUB'),
    defaultValue: 'USER'
  },
  photo: {
    type: DataTypes.STRING
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

// User.hasMany(Report, { foreignKey: 'userId'});
// Report.belongsTo(User, { foreignKey: 'userId' });

export default User