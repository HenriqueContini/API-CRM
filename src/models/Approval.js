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
    crm_id: {
        type: Sequelize.INTEGER,
        references: {
            model: CRM,
            key: 'id'
        }
    },
    setor: {
        type: Sequelize.INTEGER,
        references: {
            model: Department,
            key: 'cod_setor'
        }
    },
    responsavel: {
        type: Sequelize.STRING(10),
        references: {
            model: User,
            key: 'matricula'
        }
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

export default Approval;