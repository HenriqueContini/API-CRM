import Sequelize from "sequelize";
import db from "../config/dbconfig.js";
import User from "./User.js";
import Department from './Department.js'

const CRM = db.define('CRM', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    numero_crm: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    versao: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    requerente: {
        type: Sequelize.STRING(10),
        references: {
            model: User,
            key: 'matricula'
        }
    },
    setor: {
        type: Sequelize.INTEGER,
        references: {
            model: Department,
            key: 'cod_setor'
        }
    },
    nome_crm: {
        type: Sequelize.STRING(150),
        allowNull: false,
    },
    data_criacao: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
    },
    status_crm: {
        type: Sequelize.STRING(20),
        defaultValue: 'Pendente'
    },
    necessidade: {
        type:Sequelize.TEXT
    },
    impacto: {
        type:Sequelize.TEXT
    },
    descricao: {
        type:Sequelize.TEXT
    },
    justificativa: {
        type:Sequelize.TEXT
    },
    alternativas: {
        type:Sequelize.TEXT
    },
    sistemas_envolvidos: {
        type:Sequelize.TEXT
    },
    complexidade: {
        type:Sequelize.STRING(20)
    },
    impacto_mudanca: {
        type:Sequelize.TEXT
    },
    comportamento_offline: {
        type:Sequelize.TEXT
    },
}, {
    tableName: 'crm',
    timestamps: false
})

export default CRM;