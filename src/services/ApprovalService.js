import Approval from "../models/Approval.js";

export default class ApprovalService {
    static async putDecision(user, crm) {
        const query = await Approval.findOne({
            where: {
                decisao: 'Pendente',
                crm_id: crm,
                setor: user.setor
            }
        })

        if (query === null) {
            return {erro: true, msg: "Registro não encontrado!"};
        }

        const idApproval = query.id_aprovacao;
        
        //update aprovacoes set decisao = 'Aprovado', comentario = "Tudo em ordem", responsavel = "00003" where id_aprovacao = 12;
    }
}