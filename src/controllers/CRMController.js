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
            return res.status(404).json(user);
        }

        const newCRM = await CRMService.createCRM(user, req.body);

        if (newCRM.error === true) {
            return res.status(500).json(newCRM);
        }

        return res.status(201).json({ error: false, msg: "Criado com sucesso!" });
    }

    static async getUserCRMs(req, res) {
        const user = await UserService.checkUser(req.params.user);

        if (user.error === true) {
            return res.status(404).json(user);
        }

        const userCRMs = await CRMService.getUserCRMs(user);

        if (userCRMs.error === true) {
            return res.status(500).json(userCRMs);
        }

        return res.status(200).send(userCRMs);
    }

    static async getAwareCRMs(req, res) {
        const user = await UserService.checkUser(req.params.user);

        if (user.error === true) {
            return res.status(404).json(user);
        }

        const crms = await CRMService.getAwareCRMs(user);

        if (crms.error === true) {
            return res.status(500).json(crms);
        }

        return res.status(200).send(crms);
    }
}