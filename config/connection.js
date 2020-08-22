const Sequelize = require('sequelize');

require('dotenv').config();

const sequelize = process.env.JAWSDB_URL
  ? new Sequelize(process.env.JAWSDB_URL)
  : new Sequelize('tech_blog_db', 'admin', 'password', {
      host: 'localhost',
      dialect: 'mysql',
      port: 3001
    });

module.exports = sequelize;
