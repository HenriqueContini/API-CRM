import User from '../models/User.js';

export default class UserController {
    static async login(req, res) {
        const {matricula, senha} = req.body;

        if (matricula === null || matricula === undefined) {
            res.status(500).json({error: true, msg: 'Houve um problema com a matrícula'});
            return;
        }

        if (senha === null || senha === undefined) {
            res.status(500).json({error: true, msg: 'Houve um problema com a senha'});
            return;
        }

        try {
            const user = await User.findByPk(matricula);

            if (user === null) {
                res.status(404).json({error: true, msg: 'Usuário não encontrado!'});
            }

            if (user.senha === senha) {
                delete user.dataValues.senha;
                res.status(200).json(user);
            } else {
                res.status(500).json({error: true, msg: 'Senha incorreta'});
            }
        } catch (e) {
            res.status(404).json({error: true, msg: e.message});
        }
    }
}