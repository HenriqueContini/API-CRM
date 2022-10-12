import Sequelize from "sequelize";

const db = new Sequelize('crm', 'root', 'Root123', {
    host: 'localhost',
    dialect: 'mysql'
})

export default db;