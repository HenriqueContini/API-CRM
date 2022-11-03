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

            return {error: false, msg: "Aprovado / Rejeitado com sucesso"};
        } catch (e) {
            console.log(e);
            return {error: true, msg: "Ocorreu um erro ao aprovar / rejeitar a CRM"};
        }
        
        //update aprovacoes set decisao = 'Aprovado', comentario = "Tudo em ordem", responsavel = "00003" where id_aprovacao = 12;
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

            console.log(ITApproval)

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
        
        //update aprovacoes set decisao = 'Aprovado', comentario = "Tudo em ordem", responsavel = "00003" where id_aprovacao = 12;
    }
}