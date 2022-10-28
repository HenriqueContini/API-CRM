import { QueryTypes } from 'sequelize';
import CheckVariables from '../common/CheckVariables.js';
import db from '../config/dbconfig.js';
import User from '../models/User.js';
import CRM from '../models/CRM.js';
import CRMService from '../services/CRMService.js';
import UserService from '../services/UserService.js';

export default class CRMController {
    static async createCRM(req, res) {

        const user = await UserService.checkUser(req.body.user);

        if (user.error === true) {
            return res.status(404).json({ error: true, msg: 'Usuário não encontrado!' });
        }

        const newCRM = await CRMService.createCRM(user, req.body);

        if (newCRM.error === true) {
            return res.status(500).json({ error: true, msg: newCRM.msg });
        }

        return res.status(201).json({ error: false, msg: "Criado com sucesso!" });
    }

    static async userCRMs(req, res) {
        try {
            const user = await User.findByPk(req.params.user);

            if (CheckVariables.isNullOrUndefined(user)) {
                res.status(404).json({ error: true, msg: 'Usuário não encontrado!' });
                return;
            }

            const crms = await db.query(`SELECT cr.id, cr.numero_crm, cr.versao, u.nome as requerente, cr.nome_crm, 
                cr.descricao, DATE_FORMAT(cr.data_criacao, "%m %d %Y") as data_criacao FROM crms cr 
                INNER JOIN usuarios u on u.matricula = cr.requerente WHERE (numero_crm, versao) IN 
                (SELECT numero_crm, MAX(versao) FROM crms WHERE requerente = :user GROUP BY numero_crm);`, {
                model: CRM,
                replacements: { user: user.matricula },
                type: QueryTypes.SELECT
            })

            res.status(200).send(crms);
        } catch (e) {
            console.log(e);
            res.status(500).json({ error: true, msg: 'Erro ao buscar pelas CRMs!' });
        }
    }

    static async awareCRMs(req, res) {
        try {
            const user = await User.findByPk(req.params.user);

            if (CheckVariables.isNullOrUndefined(user)) {
                res.status(404).json({ error: true, msg: 'Usuário não encontrado!' });
                return;
            }

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
                })

                res.status(200).send(crms);
        } catch (e) {
            console.log(e);
            res.status(500).json({ error: true, msg: 'Erro ao buscar pelas CRMs!' });
        }
    }
}