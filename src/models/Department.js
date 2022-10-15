import Sequelize from "sequelize";
import db from "../config/dbconfig.js";

const Department = db.define('Department', {
    cod_setor: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: Sequelize.STRING(50)
    }
}, {
    tableName: 'setores',
    timestamps: false
})

export default Department;