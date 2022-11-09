import { QueryTypes } from "sequelize";
import db from "../config/dbconfig.js";
import Approval from "../models/Approval.js";
import CRM from "../models/CRM.js";

export default class ApprovalService {
    static async putDecision(user, crm, data) {
        try {
            const query = await Approval.findOne({
                where: {
                    decisao: 'Pendente',
                    crm_id: crm,
                    setor: user.setor
                }
            })
    
            if (query === null) {
                return {error: true, msg: "Registro não encontrado!"};
            }
    
            const idApproval = query.id_aprovacao;
    
            await Approval.update({
                decisao: data.aprovado ? 'Aprovado' : 'Rejeitado',
                comentario: data.comentario,
                responsavel: user.matricula
            }, {
                where: {
                    id_aprovacao: idApproval
                }
            })

            console.log(data.aprovado)

            if (data.aprovado === false) {
                await CRM.update({
                    status_crm: 'Rejeitado',
                }, {
                    where: {
                        id: crm
                    }
                })

                console.log('Rejeitado')

                return {error: false, msg: "Rejeitado com sucesso"};
            }

            console.log('passou')
            console.log(crm)
            
            const checkApprovals = await db.query(`select distinct(decisao) from aprovacoes where crm_id = :id;`, {
                model: Approval,
                replacements: {
                    id: crm
                },
                type: QueryTypes.SELECT
            })
            
            if (checkApprovals.length === 1 && checkApprovals[0].decisao === "Aprovado") {
                await Approval.create({
                    crm_id: crm,
                    setor: 1,
                    decisao: 'Pendente'
                })
            }
            
            return {error: false, msg: "Aprovado com sucesso"};
        } catch (e) {
            console.log(e);
            return {error: true, msg: "Ocorreu um erro ao aprovar / rejeitar a CRM"};
        }
    }

    static async putITDecision(user, crm, data) {
        try {
            const query = await Approval.findOne({
                where: {
                    decisao: 'Pendente',
                    crm_id: crm,
                    setor: user.setor
                }
            })
    
            if (query === null) {
                return {error: true, msg: "Registro não encontrado!"};
            }
    
            const idApproval = query.id_aprovacao;
    
            await Approval.update({
                decisao: data.aprovado ? 'Aprovado' : 'Rejeitado',
                comentario: data.comentario,
                responsavel: user.matricula
            }, {
                where: {
                    id_aprovacao: idApproval
                }
            })

            const ITApproval = await Approval.findByPk(idApproval);

            await CRM.update({
                status_crm: ITApproval.decisao,
                complexidade: data.complexidade,
                impacto_mudanca: data.impacto
            }, {
                where: {
                    id: crm
                }
            })

            return {error: false, msg: "TI aprovou / rejeitou com sucesso"};
        } catch (e) {
            console.log(e);
            return {error: true, msg: "Ocorreu um erro ao aprovar / rejeitar a CRM pelo TI"};
        }
    }
}