import User from "../models/User.js";

export default class UserService {
    static async login(enrollment, password) {
        try {
            const user = await User.findByPk(enrollment);
            if (user === null) {
                return {error: true, msg: 'Usuário não encontrado!'};
            }

            if (user.senha === password) {
                return {matricula: user.matricula, setor: user.setor};
            } else {
                return {error: true, msg: 'Senha incorreta!'};
            }
        } catch (e) {
            console.log(e);
            return {error: true, msg: 'Erro desconhecido!'};
        }
    }

    static async checkUser(enrollment) {
        try {
            const user = await User.findByPk(enrollment);
            
            if (user === null) {
                return {error: true, msg:"Usuário não encontrado!"};
            }

            delete user.senha;

            return user;
        } catch (e) {
            console.log(e)
            return {error: true, msg:"Ocorreu um erro ao tentar encontrar o usuário"};
        }
    }
}