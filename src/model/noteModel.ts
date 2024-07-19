import { DataTypes, Model } from 'sequelize';
import db from '../config/db.config';

interface NoteAttributes {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  userId: string
}
export class Note extends Model<NoteAttributes> {}

Note.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dueDate: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: db,
    tableName: 'Notes',
  }
);

