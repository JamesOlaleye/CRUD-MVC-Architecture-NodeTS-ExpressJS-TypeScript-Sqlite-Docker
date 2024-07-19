import { Sequelize } from 'sequelize';

const db = new Sequelize('app', '', '', {
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false,
});

export default db;
