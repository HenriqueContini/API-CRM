import { QueryTypes, Op } from 'sequelize';
import db from '../config/dbconfig.js';
import CRM from '../models/CRM.js';
import Approval from '../models/Approval.js';
import CRMFile from '../models/CRMFile.js';
import User from '../models/User.js';

export default class CRMService {
    static async createCRM(user, data, files) {
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

            if (files) {
                files.forEach(async (file) => {
                    await CRMFile.create({
                        crm_id: CRMCreated,
                        nome: file.originalname,
                        mimetype: file.mimetype,
                        fileURL: file.firebaseURL
                    })
                })
            }

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
                cr.descricao, cr.data_criacao as data_criacao FROM crms cr 
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
                and ap.decisao = 'Pendente' and ap.setor = :user_department and cr.requerente != :user;`, {
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

    static async searchCRMs(query) {
        try {
            let params = [];
    
            if (query.requerente) {
                let user = await User.findOne({
                    where: {
                        nome: {
                            [Op.like]: `%${query.requerente}%`
                        }
                    }
                })
    
                if (user) {
                    console.log(user)
                    params.push(`requerente = '${user.matricula}'`);
                }
            }
    
            if (query.numero_crm) {
                params.push(`numero_crm in (${Number(query.numero_crm)})`);
            }
    
            if (query.nome_crm) {
                params.push(`nome_crm like '%${query.nome_crm}%'`);
            }
    
            if (query.data_criacao) {
                let date = new Date(query.data_criacao);

                params.push(`DATE(data_criacao) = '${date.toISOString().split('T')[0]}'`);
            }

            if (params.length > 0) {
                const crms = db.query(`SELECT cr.id, cr.numero_crm, cr.versao, u.nome as requerente, cr.nome_crm, 
                    cr.descricao, cr.data_criacao as data_criacao FROM crms cr 
                    INNER JOIN usuarios u on u.matricula = cr.requerente WHERE ${params.join(' AND ')}`, {
                    model: CRM,
                    type: QueryTypes.SELECT
                })

                return crms;
            }
    
            return {error: true, msg: "Nenhuma CRM encontrada"}
        } catch (e) {
            console.log(e)
            return {error: true, msg: 'Ocorreu um erro ao buscar pelas CRMs'};
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

            const versions = await db.query('select id, versao from crms where numero_crm = :crm;', {
                model: CRM,
                replacements: {
                    crm: crm[0].numero_crm
                },
                type: QueryTypes.SELECT
            })

            const crmDepartments = await db.query(`select ap.id_aprovacao, ap.decisao, ap.comentario, ap.crm_id, s.nome as setor, s.cod_setor, u.nome as responsavel from aprovacoes ap 
                left join usuarios u on ap.responsavel = u.matricula
                inner join setores s on ap.setor = s.cod_setor where ap.crm_id = :id;`, {
                model: Approval,
                replacements: {
                    id: id
                },
                type: QueryTypes.SELECT
            })

            const checkApproval = await db.query(`select distinct(decisao) from aprovacoes where setor != 1 and crm_id = :id;`, {
                model: Approval,
                replacements: {
                    id: id
                },
                type: QueryTypes.SELECT
            })

            let allowIT = () => {
                if (crm[0].status_crm === 'Pendente') {
                    if (checkApproval.length === 0) {
                        return true;
                    } else if (checkApproval.length === 1) {
                        if (checkApproval[0].decisao === 'Aprovado') {
                            return true;
                        }
                        return false;
                    }
                    return false
                }
                return false;
            };

            const files = await CRMFile.findAll({
                where: {
                    crm_id: id
                }
            })

            // crm.status_crm = 'Pendente' && checkApproval.length === 1 && checkApproval[0].decisao === 'Aprovado' ? true : false;

            return { crm: crm[0], versoes: versions, setores: crmDepartments, arquivos: files, allowIT: allowIT() };
        } catch (e) {
            console.log(e);
            return { error: true, msg: 'Houve um problema ao buscar pela CRM' }
        }
    }

    static async editCRM(id, data, files) {
        try {
            const crm = await CRM.findByPk(id);

            await CRM.update({
                status_crm: 'Rejeitado'
            }, {
                where: {
                    id: crm.id
                }
            });

            const newVersion = await CRM.max('versao', {
                where: {
                    numero_crm: crm.numero_crm
                }
            })

            await CRM.create({
                numero_crm: crm.numero_crm,
                versao: newVersion + 1,
                requerente: crm.requerente,
                setor: crm.setor,
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
                    requerente: crm.requerente
                }
            })

            if (files) {
                files.forEach(async (file) => {
                    await CRMFile.create({
                        crm_id: CRMCreated,
                        nome: file.originalname,
                        mimetype: file.mimetype,
                        fileURL: file.firebaseURL
                    })
                })
            }

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

            console.log('Chegou')

            return { error: false, msg: "Criado com sucesso!" };
        } catch (e) {
            console.log(e);
            return { error: true, msg: "Falha ao tentar criar uma nova versão da CRM!" };
        }
    }
}