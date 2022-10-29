import { QueryTypes } from 'sequelize';
import db from '../config/dbconfig.js';
import User from '../models/User.js';
import CRM from '../models/CRM.js';
import Approval from '../models/Approval.js';

export default class CRMService {
    static async createCRM(user, data) {
        try {
            const lastCRM = await CRM.max('numero_crm');

            if (lastCRM === null || lastCRM === undefined) {
                lastCRM = 0;
            }

            await CRM.create({
                numero_crm: lastCRM + 1,
                requerente: user.matricula,
                setor: user.setor,
                nome_crm: data.nome_crm,
                necessidade: data.necessidade,
                impacto: data.impacto,
                descricao: data.descricao,
                objetivo: data.objetivo,
                justificativa: data.justificativa,
                alternativa: data.alternativa,
                sistemas_envolvidos: data.sistemas,
                comportamento_offline: data.offline,
                dependencia: data.dependencia
            })

            const CRMCreated = await CRM.max('id', {
                where: {
                    requerente: user.matricula
                }
            })

            await Approval.create({
                crm_id: CRMCreated,
                setor: 1
            })

            if (data.setores !== undefined) {
                let crm_departments = JSON.parse(data.setores);

                crm_departments.forEach(async (department) => {
                    await Approval.create({
                        crm_id: CRMCreated,
                        setor: department
                    })
                })
            }

            return { error: false, msg: "Criado com sucesso!" };
        } catch (e) {
            console.log(e)
            return { error: true, msg: "Erro ao criar uma CRM!" };
        }
    }

    static async getUserCRMs(user) {
        try {
            const crms = await db.query(`SELECT cr.id, cr.numero_crm, cr.versao, u.nome as requerente, cr.nome_crm, 
                cr.descricao, DATE_FORMAT(cr.data_criacao, "%m %d %Y") as data_criacao FROM crms cr 
                INNER JOIN usuarios u on u.matricula = cr.requerente WHERE (numero_crm, versao) IN 
                (SELECT numero_crm, MAX(versao) FROM crms WHERE requerente = :user GROUP BY numero_crm);`, {
                model: CRM,
                replacements: { user: user.matricula },
                type: QueryTypes.SELECT
            })

            return crms;
        } catch (e) {
            console.log(e);
            return { error: true, msg: 'Erro ao buscar pelas CRMs!' };
        }
    }
}