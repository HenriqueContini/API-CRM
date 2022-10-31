import ApprovalService from "../services/ApprovalService.js";
import UserService from "../services/UserService.js";

export default class ApprovalController {
    static async putDecision (req, res) {
        const user = await UserService.checkUser(req.body.user);

        if (user.error === true) {
            return res.status(404).json(user);
        }

        const decision = await ApprovalService.putDecision(user, req.params.crm, req.body.aprovado, 
            req.body.comentario
        );
    }
}