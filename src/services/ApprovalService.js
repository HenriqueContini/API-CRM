import Approval from "../models/Approval.js";

export default class ApprovalService {
    static async putDecision(user, crm, decision, comment) {
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
                decisao: decision ? 'Aprovado' : 'Rejeitado',
                comentario: comment,
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
}