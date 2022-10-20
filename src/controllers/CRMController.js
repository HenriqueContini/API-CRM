import CheckVariables from '../common/CheckVariables.js';
import db from '../config/dbconfig.js';
import User from '../models/User.js';
import CRM from '../models/CRM.js';

export default class CRMController {
    static async createCRM(req, res) {
        try {
            const user = await User.findByPk(req.body.user);

            if (CheckVariables.isNullOrUndefined(user)) {
                res.status(404).json({error: true, msg: 'Usuário não encontrado!'});
                return;
            }

            let lastCRM = await CRM.max('numero_crm');

            if (CheckVariables.isNullOrUndefined(lastCRM)) {
                lastCRM = 0;
            }

            await CRM.create({
                numero_crm: lastCRM + 1,
                requerente: user.matricula,
                setor: user.setor,
                nome_crm: req.body.nome_crm,
                necessidade: req.body.necessidade,
                impacto: req.body.impacto,
                descricao: req.body.descricao,
                objetivo: req.body.objetivo,
                justificativa: req.body.justificativa,
                alternativa: req.body.alternativa,
                sistemas_envolvidos: req.body.sistemas,
                comportamento_offline: req.body.offline,
                dependencia: req.body.dependencia
            })

            res.status(200).json({error: false, msg: "Criado com sucesso!"});
        } catch(e) {
            res.status(500).json({error: true, msg: 'Erro ao criar uma CRM!'});
        }
    }

    static async usercrm(req, res) {
        // select id, numero_crm, max(versao), requerente, descricao, data_criacao from crms where requerente = '00002' group by numero_crm;

        try {
            const user = await User.findByPk(req.params.user);

            console.log(user)

            if (CheckVariables.isNullOrUndefined(user)) {
                res.status(404).json({error: true, msg: 'Usuário não encontrado!'});
                return;
            }

            const crms = await CRM.findAll({
                attributes: ['id', 'numero_crm', [db.fn('MAX', db.col('versao')), 'ultima_versao'], 'requerente', 'descricao', 'data_criacao'],
                where: {
                    requerente: user.matricula
                },
                group: 'numero_crm'
            });

            res.status(200).send(crms);
        } catch (e) {
            console.log(e);
            res.status(500).json({error: true, msg: 'Erro ao buscar pelas CRMs!'});
        }
    }
}