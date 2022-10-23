import { QueryTypes } from 'sequelize';
import CheckVariables from '../common/CheckVariables.js';
import db from '../config/dbconfig.js';
import User from '../models/User.js';
import CRM from '../models/CRM.js';
import Approval from '../models/Approval.js';

export default class CRMController {
    static async createCRM(req, res) {
        try {
            const user = await User.findByPk(req.body.user);

            if (CheckVariables.isNullOrUndefined(user)) {
                res.status(404).json({ error: true, msg: 'Usuário não encontrado!' });
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

            const lastId = await CRM.max('id', {
                where: {
                    requerente: user.matricula
                }
            })

            await Approval.create({
                crm_id: lastId,
                setor: 1
            })

            let crm_departments = JSON.parse(req.body.setores);

            crm_departments.forEach(async (department) => {
                await Approval.create({
                    crm_id: lastId,
                    setor: department
                })
            })

            res.status(200).json({ error: false, msg: "Criado com sucesso!" });
        } catch (e) {
            console.log(e)
            res.status(500).json({ error: true, msg: 'Erro ao criar uma CRM!' });
        }
    }

    static async userCRMs(req, res) {
        try {
            const user = await User.findByPk(req.params.user);

            if (CheckVariables.isNullOrUndefined(user)) {
                res.status(404).json({ error: true, msg: 'Usuário não encontrado!' });
                return;
            }

            const crms = await db.query(`SELECT cr.id, cr.numero_crm, cr.versao, u.nome as usuario, cr.nome_crm FROM crms cr 
                INNER JOIN usuarios u on u.matricula = cr.requerente WHERE (numero_crm, versao) IN 
                (SELECT numero_crm, MAX(versao) FROM crms where requerente = :user GROUP BY numero_crm);`, {
                    model: CRM,
                    replacements: {user: user.matricula},
                    type: QueryTypes.SELECT
                })

            res.status(200).send(crms);
        } catch (e) {
            console.log(e);
            res.status(500).json({ error: true, msg: 'Erro ao buscar pelas CRMs!' });
        }
    }

    // static async awareCRMs(req, res) {

    // }
}