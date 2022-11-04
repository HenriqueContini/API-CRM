import Sequelize from "sequelize";
import db from "../config/dbconfig.js";
import Department from './Department.js'

const User = db.define('User', {
    matricula: {
        type: Sequelize.STRING(10),
        allowNull: false,
        primaryKey: true,
    },
    nome: {
        type: Sequelize.STRING(100)
    },
    email: {
        type: Sequelize.STRING(100)
    },
    senha: {
        type: Sequelize.STRING(100)
    },
    imagem_usuario: {
        type: Sequelize.STRING(200)
    }
}, {
    tableName: 'usuarios',
    timestamps: false
})

User.belongsTo(Department, {
    foreignKey: 'setor'
})

export default User;