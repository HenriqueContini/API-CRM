import CRMService from '../services/CRMService.js';
import UserService from '../services/UserService.js';

export default class CRMController {
    static async createCRM(req, res) {
        const user = await UserService.checkUser(req.body.user);

        if (user.error === true) {
            return res.status(404).json(user);
        }

        const newCRM = await CRMService.createCRM(user, req.body, req.files);

        if (newCRM.error === true) {
            return res.status(500).json(newCRM);
        }

        return res.status(201).json(newCRM);
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

    static async searchCRMs(req, res) {
        const crms = await CRMService.searchCRMs(req.query);

        return res.status(200).send(crms);
    }

    static async getCRM(req, res) {
        const crm = await CRMService.getCRM(req.params.id);

        if (crm.error === true) {
            return res.status(500).json(crm);
        }

        return res.status(200).send(crm);
    }

    static async editCRM(req, res) {
        const crm = await CRMService.editCRM(req.params.id, req.body, req.files);

        if (crm.error === true) {
            return res.status(500).json(crm)
        }

        return res.status(201).json(crm);
    }
}