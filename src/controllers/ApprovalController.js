import ApprovalService from "../services/ApprovalService.js";
import UserService from "../services/UserService.js";

export default class ApprovalController {
    static async putDecision (req, res) {
        const user = await UserService.checkUser(req.body.user);

        if (user.error === true) {
            return res.status(404).json(user);
        }

        if (req.body.aprovado === null || req.body.aprovado === undefined) {
            return res.status(400).json({error: true, msg: "É necessário a aprovação ou rejeição para realizar a operação!"})
        }

        const decision = await ApprovalService.putDecision(user, req.params.crm, req.body);

        if (decision.error === true) {
            return res.status(500).json(decision);
        }

        return res.status(201).json(decision);
    }

    static async putITDecision (req, res) {
        const user = await UserService.checkUser(req.body.user);

        if (user.error === true) {
            return res.status(404).json(user);
        }

        if (req.body.aprovado === null || req.body.aprovado === undefined) {
            return res.status(400).json({error: true, msg: "É necessário a aprovação ou rejeição para realizar a operação!"})
        }

        const decision = await ApprovalService.putITDecision(user, req.params.crm, req.body);

        if (decision.error === true) {
            return res.status(500).json(decision);
        }

        return res.status(201).json(decision);
    }
}