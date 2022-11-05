import Sequelize from "sequelize";
import db from "../config/dbconfig.js";
import CRM from "./CRM.js";

const CRMFile = db.define('CRMFile', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: Sequelize.STRING(300)
    },
    mimetype: {
        type: Sequelize.STRING(200)
    },
    fileURL: {
        type: Sequelize.STRING(500)
    }
}, {
    tableName: 'arquivos_crm',
    timestamps: false
})

CRMFile.belongsTo(CRM, {
    foreignKey: 'crm_id'
})

export default CRMFile;