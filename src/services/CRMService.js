import { QueryTypes } from 'sequelize';
import db from '../config/dbconfig.js';
import CRM from '../models/CRM.js';
import Approval from '../models/Approval.js';

export default class CRMService {
    static async createCRM(user, data) {
        try {
            let lastCRM = await CRM.max('numero_crm');

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
                setor: 1,
                decisao: 'Pendente'
            })

            if (data.setores !== undefined) {
                let crm_departments = JSON.parse(data.setores);

                crm_departments.forEach(async (department) => {
                    await Approval.create({
                        crm_id: CRMCreated,
                        setor: department,
                        decisao: 'Pendente'
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

    static async getAwareCRMs(user) {
        try {
            const crms = await db.query(`select cr.id, cr.numero_crm, cr.versao, u.nome as requerente, cr.nome_crm, 
                cr.descricao, DATE_FORMAT(cr.data_criacao, "%m %d %Y") as data_criacao from crms cr
                inner join aprovacoes ap on cr.id = ap.crm_id
                inner join usuarios u on cr.requerente = u.matricula
                WHERE (cr.numero_crm, cr.versao) IN (SELECT numero_crm, MAX(versao) FROM crms GROUP BY numero_crm) 
                and ap.setor = :user_department and cr.requerente != :user;`, {
                model: CRM,
                replacements: {
                    user: user.matricula,
                    user_department: user.setor
                },
                type: QueryTypes.SELECT
            });

            return crms;
        } catch (e) {
            console.log(e);
            return { error: true, msg: 'Erro ao buscar pelas CRMs!' };
        }
    }

    static async getCRM(id) {
        try {
            const crm = await db.query(`select cr.id, cr.numero_crm, cr.versao, u.nome as requerente, cr.requerente as requerente_matricula, u.email as email, s.nome as setor, 
                cr.nome_crm, DATE_FORMAT(cr.data_criacao, "%m %d %Y") as data_criacao, cr.status_crm, cr.necessidade, cr.impacto, 
                cr.descricao, cr.objetivo, cr.justificativa, cr.alternativa, cr.sistemas_envolvidos, cr.comportamento_offline, 
                cr.dependencia, cr.complexidade, cr.impacto_mudanca from crms cr 
                inner join usuarios u on cr.requerente = u.matricula inner join setores s on cr.setor = s.cod_setor where cr.id = :id;`, {
                model: CRM,
                replacements: {
                    id: id
                },
                type: QueryTypes.SELECT
            });

            if (crm === null) {
                return { error: true, msg: 'CRM não encontrada!' };
            }

            const crmDepartments = await db.query(`select a.id_aprovacao, a.decisao, a.comentario, a.crm_id, a.responsavel, s.cod_setor, s.nome as setor from aprovacoes a
                inner join setores s on a.setor = s.cod_setor where a.crm_id = :id;`, {
                model: Approval,
                replacements: {
                    id: id
                },
                type: QueryTypes.SELECT
            })

            return { crm: crm[0], setores: crmDepartments };
        } catch (e) {
            console.log(e);
            return { error: true, msg: 'Houve um problema ao buscar pela CRM' }
        }
    }
}