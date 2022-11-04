import UserService from "../services/UserService.js";

export default class UserController {
    static async login(req, res) {
        const {matricula, senha} = req.body;

        if (matricula === null || matricula === undefined) {
            res.status(401).json({error: true, msg: 'Houve um problema com a matrícula'});
        }

        if (senha === null || senha === undefined) {
            res.status(401).json({error: true, msg: 'Houve um problema com a matrícula'});
        }

        const loginResult = await UserService.login(matricula, senha);

        if (loginResult.error === true) {
            return res.status(500).json(loginResult);
        }

        return res.status(200).json(loginResult);
    }

    static async getUser(req, res) {
        const user = await UserService.getUser(req.params.user);

        if (user.error === true) {
            return res.status(500).json(user);
        }
        
        return res.status(200).json(user)
    }
    
    static async updateUser(req, res) {
        const user = await UserService.getUser(req.params.user);
        
        if (user.error === true) {
            return res.status(400).json(user);
        }
        
        const update = await UserService.updateUser(user.matricula, req.body, req.file);
        
        if (update.error === true) {
            return res.status(500).json(update);
        }

        return res.status(200).json(update);
    }
}