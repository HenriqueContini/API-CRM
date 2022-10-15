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
    setor: {
        type: Sequelize.INTEGER,
        references: {
            model: Department,
            key: 'cod_setor'
        }
    },
    senha: {
        type: Sequelize.STRING(100)
    }
}, {
    tableName: 'usuarios',
    timestamps: false
})

export default User;