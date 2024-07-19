import { DataTypes, Model } from 'sequelize';
import db from '../config/db.config';
import { Note } from './noteModel';

interface UserAttributes {
  id: string;
  fullName: string;
  email: string;
  gender: string;
  phone: string;
  address: string;
  password: string
  confirm_password: string
}
export class User extends Model<UserAttributes> {}

User.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    confirm_password: {
      type: DataTypes.STRING,
      allowNull: false
    },
  },
  {
    sequelize: db,
    modelName: 'Users',
  }
);

User.hasMany(Note, { foreignKey: 'userId', as: 'Notes' });
Note.belongsTo(User, { foreignKey: 'userId', as: 'Users' });
