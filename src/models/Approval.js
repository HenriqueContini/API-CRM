import Sequelize from "sequelize";
import db from "../config/dbconfig.js";
import Department from "./Department.js";
import CRM from "./CRM.js";
import User from "./User.js";

const Approval = db.define('Approval', {
    id_aprovacao: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    decisao: {
        type: Sequelize.STRING(20),
        defaultValue: 'Pendente'
    },
    comentario: {
        type: Sequelize.TEXT
    }
}, {
    tableName: 'aprovacoes',
    timestamps: false
})

Approval.belongsTo(CRM, {
    foreignKey: 'crm_id'
})

Approval.belongsTo(Department, {
    foreignKey: 'setor'
})

Approval.belongsTo(User, {
    foreignKey: 'responsavel'
})

export default Approval;