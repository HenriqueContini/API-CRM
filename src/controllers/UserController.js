import CheckVariables from '../common/CheckVariables.js';
import User from '../models/User.js';

export default class UserController {
    static async login(req, res) {
        const {matricula, senha} = req.body;

        if (CheckVariables.isNullOrUndefined(matricula)) {
            res.status(500).json({error: true, msg: 'Houve um problema com a matrícula'});
            return;
        }

        if (CheckVariables.isNullOrUndefined(senha)) {
            res.status(500).json({error: true, msg: 'Houve um problema com a senha'});
            return;
        }

        try {
            const user = await User.findByPk(matricula);

            if (CheckVariables.isNullOrUndefined(user)) {
                res.status(404).json({error: true, msg: 'Usuário não encontrado!'});
                return;
            }

            if (user.senha === senha) {
                res.status(200).json(user.matricula);
            } else {
                res.status(500).json({error: true, msg: 'Senha incorreta'});
            }
        } catch (e) {
            res.status(404).json({error: true, msg: e.message});
        }
    }
}