import Sequelize from "sequelize";

const db = new Sequelize('crm', 'root', 'Root123', {
    host: 'localhost',
    dialect: 'mysql'
})

try {
    await db.authenticate();
    console.log('Connection has been established successfully.');
} catch (e) {
    console.log('Unable to connect to the database:', e);
}

export default db;